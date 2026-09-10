from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.boss_skins import BOSS_SKIN_IDS

SkinId = Literal[tuple(BOSS_SKIN_IDS)]


class JefeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre_marca: str
    logo_url: str
    color_hex: str
    skin_id: str
    mensaje: str | None
    monto_pagado: float
    hp_max: int
    danio_por_golpe: float
    frecuencia_ataque_segundos: float
    es_top1: bool
    creado_en: datetime


class CrearCheckoutRequest(BaseModel):
    nombre_marca: str = Field(min_length=1, max_length=100)
    logo_url: str
    color_hex: str = Field(pattern=r"^#[0-9a-fA-F]{6}$")
    skin_id: SkinId
    mensaje: str | None = Field(default=None, max_length=140)
    monto_deseado: float = Field(gt=0)


class CrearCheckoutResponse(BaseModel):
    checkout_url: str
    jefe_id: int


class IniciarCombateRequest(BaseModel):
    jefe_id: int
    sesion_id: str = Field(min_length=1, max_length=64)


class AtacarRequest(BaseModel):
    jefe_id: int
    danio_infligido: float = Field(ge=0)
    sesion_id: str = Field(min_length=1, max_length=64)


class AtacarResponse(BaseModel):
    jefe_id: int
    hp_actual: float
    hp_max: int
    derrotado: bool


class LeaderboardCreate(BaseModel):
    nombre_3_letras: str = Field(min_length=3, max_length=3)
    jefes_vencidos_total: int = Field(ge=0)
    vencio_top1: bool = False


class LeaderboardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre_3_letras: str
    jefes_vencidos_total: int
    vencio_top1: bool
    creado_en: datetime


class StatsOut(BaseModel):
    jugadores_activos_estimado: int
    monto_total_recaudado: float
    jefe_top1_actual: JefeOut | None
    stripe_configurado: bool
