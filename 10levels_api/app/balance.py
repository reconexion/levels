"""Formulas that turn a brand's monto_pagado into in-game boss stats.

Tune the constants below to rebalance every boss at once — nothing else in the
codebase should hardcode these numbers.
"""

HP_BASE = 100
HP_PER_MONTO = 2.0

DANIO_BASE = 5
DANIO_PER_MONTO = 0.05

FRECUENCIA_ATAQUE_BASE_SEGUNDOS = 3.0
FRECUENCIA_ATAQUE_MIN_SEGUNDOS = 0.5
FRECUENCIA_ATAQUE_MONTO_DIVISOR = 1000.0


def calcular_stats(monto_pagado: float) -> dict:
    monto = float(monto_pagado)
    hp_max = HP_BASE + monto * HP_PER_MONTO
    danio_por_golpe = DANIO_BASE + monto * DANIO_PER_MONTO
    frecuencia_ataque_segundos = max(
        FRECUENCIA_ATAQUE_MIN_SEGUNDOS,
        FRECUENCIA_ATAQUE_BASE_SEGUNDOS - monto / FRECUENCIA_ATAQUE_MONTO_DIVISOR,
    )
    return {
        "hp_max": round(hp_max),
        "danio_por_golpe": round(danio_por_golpe, 2),
        "frecuencia_ataque_segundos": round(frecuencia_ataque_segundos, 2),
    }
