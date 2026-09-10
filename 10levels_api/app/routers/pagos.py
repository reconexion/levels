import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.balance import calcular_stats
from app.config import settings
from app.database import get_db
from app.models import Jefe
from app.schemas import CrearCheckoutRequest, CrearCheckoutResponse

router = APIRouter(prefix="/api/pagos", tags=["pagos"])


@router.post("/crear-checkout", response_model=CrearCheckoutResponse)
def crear_checkout(payload: CrearCheckoutRequest, db: Session = Depends(get_db)):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe no está configurado todavía")

    actual_top1 = db.scalar(select(Jefe).where(Jefe.es_top1.is_(True)))
    precio_minimo = float(actual_top1.monto_pagado) if actual_top1 is not None else 0.0
    if payload.monto_deseado <= precio_minimo:
        raise HTTPException(
            status_code=400,
            detail=f"Tu monto debe superar ${precio_minimo:,.0f} para convertirte en el jefe #1",
        )

    stripe.api_key = settings.stripe_secret_key

    # monto_pagado/hp_max/etc. are placeholders here — they only become real once the
    # webhook confirms checkout.session.completed. activo stays False until then, so it
    # never shows up in the boss list nor contests the #1 spot before payment clears.
    stats_preview = calcular_stats(payload.monto_deseado)
    jefe = Jefe(
        nombre_marca=payload.nombre_marca,
        logo_url=payload.logo_url,
        color_hex=payload.color_hex,
        skin_id=payload.skin_id,
        mensaje=payload.mensaje,
        monto_pagado=payload.monto_deseado,
        hp_max=stats_preview["hp_max"],
        danio_por_golpe=stats_preview["danio_por_golpe"],
        frecuencia_ataque_segundos=stats_preview["frecuencia_ataque_segundos"],
        activo=False,
    )
    db.add(jefe)
    db.commit()
    db.refresh(jefe)

    session = stripe.checkout.Session.create(
        mode="payment",
        payment_method_types=["card"],
        line_items=[
            {
                "price_data": {
                    "currency": "mxn",
                    "unit_amount": round(payload.monto_deseado * 100),
                    "product_data": {
                        "name": f"10 Levels — sé el jefe #1: {payload.nombre_marca}",
                    },
                },
                "quantity": 1,
            }
        ],
        metadata={"jefe_id": str(jefe.id)},
        success_url=f"{settings.frontend_url}/?patrocinio=exito&jefe_id={jefe.id}",
        cancel_url=f"{settings.frontend_url}/?patrocinio=cancelado",
    )

    return CrearCheckoutResponse(checkout_url=session.url, jefe_id=jefe.id)
