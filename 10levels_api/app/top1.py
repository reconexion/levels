from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Jefe


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
