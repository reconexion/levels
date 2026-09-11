from sqlalchemy import select
from sqlalchemy.orm import Session

from app.balance import calcular_stats
from app.models import Jefe


def activar_desde_sesion_pagada(db: Session, jefe: Jefe, session) -> None:
    """Apply a paid Checkout Session's real amount to `jefe` and activate it.

    Shared by both activation paths — the `checkout.session.completed` webhook
    and the /api/pagos/confirmar/{id} fallback that asks Stripe directly — so
    a jefe ends up with identical stats regardless of which path confirmed it.
    Safe to call more than once: a no-op once `jefe.activo` is already True.
    """
    if jefe.activo:
        return

    monto_pagado = session["amount_total"] / 100
    stats = calcular_stats(monto_pagado)
    jefe.monto_pagado = monto_pagado
    jefe.hp_max = stats["hp_max"]
    jefe.danio_por_golpe = stats["danio_por_golpe"]
    jefe.frecuencia_ataque_segundos = stats["frecuencia_ataque_segundos"]
    activar_jefe(db, jefe)


def activar_jefe(db: Session, jefe: Jefe) -> None:
    """Activate a paid-for jefe, handing it the #1 spot if it outpaid the reigning one.

    Only the #1 slot is ever contested — every other jefe just sorts by monto_pagado.
    """
    actual_top1 = db.scalar(select(Jefe).where(Jefe.es_top1.is_(True)))

    if actual_top1 is None or jefe.monto_pagado > actual_top1.monto_pagado:
        if actual_top1 is not None:
            actual_top1.es_top1 = False
        jefe.es_top1 = True

    jefe.activo = True
    db.commit()
