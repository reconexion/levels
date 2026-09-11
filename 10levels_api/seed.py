"""Creates the tables (if missing) and inserts sample jefes for local dev,
so the frontend has something to hit at /api/jefes before Stripe is wired up.

Usage: python seed.py
"""

from app.balance import calcular_stats
from app.database import Base, SessionLocal, engine
from app.models import Jefe

MARCAS_DE_PRUEBA = [
    {
        "nombre_marca": "Cyberdyne Sodas",
        "logo_url": "https://placehold.co/128x128/ff5d5d/ffffff?text=CYD",
        "color_hex": "#ff5d5d",
        "skin_id": "pro",
        "categoria": "Comida y Bebida",
        "mensaje": "¿Te atreves a retarme?",
        "link_url": "https://example.com/cyberdyne-sodas",
        "monto_pagado": 5000,
    },
    {
        "nombre_marca": "Nimbus Tacos",
        "logo_url": "https://placehold.co/128x128/4d9bff/ffffff?text=NIM",
        "color_hex": "#4d9bff",
        "skin_id": "maestro",
        "categoria": "Comida y Bebida",
        "mensaje": "Tacos de vapor, golpes de acero.",
        "link_url": "https://example.com/nimbus-tacos",
        "monto_pagado": 2500,
    },
    {
        "nombre_marca": "Quetzal Energy",
        "logo_url": "https://placehold.co/128x128/4ddc8a/ffffff?text=QTZ",
        "color_hex": "#4ddc8a",
        "skin_id": "experto",
        "categoria": "Deportes",
        "mensaje": None,
        "link_url": None,
        "monto_pagado": 900,
    },
    {
        "nombre_marca": "Chido Games",
        "logo_url": "https://placehold.co/128x128/ffd23f/222222?text=CHG",
        "color_hex": "#ffd23f",
        "skin_id": "amateur",
        "categoria": "Videojuegos",
        "mensaje": "Todavía estoy calentando.",
        "link_url": "https://example.com/chido-games",
        "monto_pagado": 150,
    },
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Jefe).count() > 0:
            print("La tabla jefes ya tiene datos, no se insertó nada.")
            return

        ordenados = sorted(MARCAS_DE_PRUEBA, key=lambda m: m["monto_pagado"], reverse=True)
        for i, marca in enumerate(ordenados):
            stats = calcular_stats(marca["monto_pagado"])
            jefe = Jefe(
                nombre_marca=marca["nombre_marca"],
                logo_url=marca["logo_url"],
                color_hex=marca["color_hex"],
                skin_id=marca["skin_id"],
                categoria=marca["categoria"],
                mensaje=marca["mensaje"],
                link_url=marca["link_url"],
                monto_pagado=marca["monto_pagado"],
                hp_max=stats["hp_max"],
                danio_por_golpe=stats["danio_por_golpe"],
                frecuencia_ataque_segundos=stats["frecuencia_ataque_segundos"],
                es_top1=(i == 0),
                activo=True,
            )
            db.add(jefe)
        db.commit()
        print(f"Insertados {len(ordenados)} jefes de prueba.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
