import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.balance import calcular_stats
from app.config import settings
from app.database import get_db
from app.models import Jefe
from app.top1 import activar_jefe

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/stripe")
async def webhook_stripe(request: Request, db: Session = Depends(get_db)):
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=503, detail="Stripe no está configurado todavía")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Firma de webhook inválida")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if session.get("payment_status") != "paid":
            return {"received": True}

        jefe_id = (session.get("metadata") or {}).get("jefe_id")
        jefe = db.get(Jefe, int(jefe_id)) if jefe_id else None
        if jefe is not None and not jefe.activo:
            monto_pagado = session["amount_total"] / 100
            stats = calcular_stats(monto_pagado)
            jefe.monto_pagado = monto_pagado
            jefe.hp_max = stats["hp_max"]
            jefe.danio_por_golpe = stats["danio_por_golpe"]
            jefe.frecuencia_ataque_segundos = stats["frecuencia_ataque_segundos"]
            activar_jefe(db, jefe)

    return {"received": True}
