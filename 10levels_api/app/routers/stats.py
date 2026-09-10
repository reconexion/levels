from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import combate_state
from app.config import settings
from app.database import get_db
from app.models import Jefe
from app.schemas import StatsOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("", response_model=StatsOut)
def obtener_stats(db: Session = Depends(get_db)):
    jefe_top1 = db.scalar(select(Jefe).where(Jefe.es_top1.is_(True), Jefe.activo.is_(True)))

    return StatsOut(
        jugadores_activos_estimado=combate_state.count_active_sessions(),
        jefe_top1_actual=jefe_top1,
        stripe_configurado=bool(settings.stripe_secret_key),
    )
