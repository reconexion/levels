from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import combate_state
from app.database import get_db
from app.models import Jefe
from app.schemas import AtacarRequest, AtacarResponse, IniciarCombateRequest

router = APIRouter(prefix="/api/combate", tags=["combate"])


@router.post("/iniciar", response_model=AtacarResponse)
def iniciar_combate(payload: IniciarCombateRequest, db: Session = Depends(get_db)):
    jefe = db.get(Jefe, payload.jefe_id)
    if jefe is None or not jefe.activo:
        raise HTTPException(status_code=404, detail="Jefe no encontrado")

    combate_state.reset(payload.sesion_id, jefe.id, jefe.hp_max)
    return AtacarResponse(jefe_id=jefe.id, hp_actual=jefe.hp_max, hp_max=jefe.hp_max, derrotado=False)


@router.post("/atacar", response_model=AtacarResponse)
def atacar(payload: AtacarRequest, db: Session = Depends(get_db)):
    jefe = db.get(Jefe, payload.jefe_id)
    if jefe is None or not jefe.activo:
        raise HTTPException(status_code=404, detail="Jefe no encontrado")

    hp_actual = combate_state.apply_damage(
        payload.sesion_id, jefe.id, jefe.hp_max, payload.danio_infligido
    )
    return AtacarResponse(
        jefe_id=jefe.id,
        hp_actual=hp_actual,
        hp_max=jefe.hp_max,
        derrotado=hp_actual <= 0,
    )
