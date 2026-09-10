from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Jefe
from app.schemas import JefeOut

router = APIRouter(prefix="/api/jefes", tags=["jefes"])


@router.get("", response_model=list[JefeOut])
def listar_jefes(db: Session = Depends(get_db)):
    jefes = db.scalars(
        select(Jefe).where(Jefe.activo.is_(True)).order_by(Jefe.monto_pagado.desc())
    ).all()
    return jefes


@router.get("/{jefe_id}", response_model=JefeOut)
def obtener_jefe(jefe_id: int, db: Session = Depends(get_db)):
    jefe = db.get(Jefe, jefe_id)
    if jefe is None or not jefe.activo:
        raise HTTPException(status_code=404, detail="Jefe no encontrado")
    return jefe
