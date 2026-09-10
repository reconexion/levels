from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Jefe(Base):
    __tablename__ = "jefes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    nombre_marca: Mapped[str] = mapped_column(String(100), nullable=False)
    logo_url: Mapped[str] = mapped_column(String, nullable=False)
    color_hex: Mapped[str] = mapped_column(String(7), nullable=False)
    skin_id: Mapped[str] = mapped_column(String(20), nullable=False, default="noob")
    mensaje: Mapped[str | None] = mapped_column(String(140), nullable=True)
    monto_pagado: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    hp_max: Mapped[int] = mapped_column(Integer, nullable=False)
    danio_por_golpe: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    frecuencia_ataque_segundos: Mapped[float] = mapped_column(Numeric(4, 2), nullable=False)
    es_top1: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    creado_en: Mapped[object] = mapped_column(DateTime, server_default=func.now())
