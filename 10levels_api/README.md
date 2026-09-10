# 10 Levels API

Backend FastAPI + PostgreSQL para el juego 10 Levels (jefes patrocinados, pagos con Stripe,
leaderboard). Ver el spec completo del proyecto para el detalle de mecánica y modelo de datos.

## Arranque local

```bash
# 1. Base de datos (Postgres en Docker)
docker compose up -d

# 2. Entorno Python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Variables de entorno
cp .env.example .env

# 4. Tablas + datos de prueba (sin Stripe)
python seed.py

# 5. Levantar la API
uvicorn app.main:app --reload
```

La API queda en `http://localhost:8000` (docs interactivas en `/docs`).

## Estructura

- `app/models.py` — tablas `jefes` y `leaderboard` (SQLAlchemy).
- `app/balance.py` — fórmulas hp_max/daño/frecuencia de ataque a partir de `monto_pagado`.
  Todos los valores de balance viven ahí; ajustar el juego no debería tocar los routers.
- `app/top1.py` — lógica de disputa del puesto #1.
- `app/combate_state.py` — HP de combate en memoria, por sesión de navegador
  (`sesion_id` la genera el frontend, no hay cuentas de usuario). En un despliegue con
  varios workers esto debería migrar a Redis.
- `app/routers/` — un router por grupo de endpoints del spec (jefes, pagos, webhooks,
  combate, leaderboard, stats).
- `seed.py` — crea las tablas y carga jefes de prueba para desarrollar el frontend sin Stripe.

## Pendiente (según prioridad del spec)

- Conectar el frontend real a `/api/jefes` y `/api/leaderboard`.
- Probar el flujo de Stripe con claves de test (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
  en `.env`, y `stripe listen --forward-to localhost:8000/api/webhooks/stripe`).
- Rate limiting básico antes de manejar tráfico real.
