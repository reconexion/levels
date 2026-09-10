from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Leaderboard
from app.schemas import LeaderboardCreate, LeaderboardOut

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.post("", response_model=LeaderboardOut, status_code=201)
def crear_entrada(payload: LeaderboardCreate, db: Session = Depends(get_db)):
    entrada = Leaderboard(
        nombre_3_letras=payload.nombre_3_letras.upper(),
        jefes_vencidos_total=payload.jefes_vencidos_total,
        vencio_top1=payload.vencio_top1,
    )
    db.add(entrada)
    db.commit()
    db.refresh(entrada)
    return entrada


@router.get("", response_model=list[LeaderboardOut])
def top_leaderboard(db: Session = Depends(get_db)):
    entradas = db.scalars(
        select(Leaderboard).order_by(Leaderboard.jefes_vencidos_total.desc()).limit(10)
    ).all()
    return entradas
