"""Adds 10 extra demo jefes on top of whatever is already in the DB, to simulate
a fuller dataset for testing search/filter/pagination at scale. Purely additive —
never touches or deletes existing rows (including real sponsor data), and never
outranks the current #1 (all amounts stay below it).

Usage: python seed_extra.py
"""

from app.balance import calcular_stats
from app.database import SessionLocal
from app.models import Jefe

MARCAS_EXTRA = [
    {
        "nombre_marca": "Voltek Motors",
        "logo_url": "https://placehold.co/128x128/5ec8ff/111111?text=VLT",
        "color_hex": "#5ec8ff",
        "skin_id": "avanzado",
        "categoria": "Tecnología",
        "mensaje": "Acelera o quédate atrás.",
        "link_url": "https://example.com/voltek-motors",
        "monto_pagado": 3200,
    },
    {
        "nombre_marca": "Pixel Forge Studios",
        "logo_url": "https://placehold.co/128x128/b070ff/ffffff?text=PXF",
        "color_hex": "#b070ff",
        "skin_id": "leyenda",
        "categoria": "Videojuegos",
        "mensaje": "Nivel final desbloqueado.",
        "link_url": "https://example.com/pixel-forge",
        "monto_pagado": 2100,
    },
    {
        "nombre_marca": "Urbana Threads",
        "logo_url": "https://placehold.co/128x128/ff5ec8/111111?text=URB",
        "color_hex": "#ff5ec8",
        "skin_id": "competente",
        "categoria": "Ropa y Moda",
        "mensaje": "Viste el golpe.",
        "link_url": "https://example.com/urbana-threads",
        "monto_pagado": 1750,
    },
    {
        "nombre_marca": "Noctura Films",
        "logo_url": "https://placehold.co/128x128/ffd23f/222222?text=NCT",
        "color_hex": "#ffd23f",
        "skin_id": "maestro",
        "categoria": "Entretenimiento",
        "mensaje": "La función ya empezó.",
        "link_url": "https://example.com/noctura-films",
        "monto_pagado": 1400,
    },
    {
        "nombre_marca": "Cumbre Athletics",
        "logo_url": "https://placehold.co/128x128/39ff9e/111111?text=CMB",
        "color_hex": "#39ff9e",
        "skin_id": "experto",
        "categoria": "Deportes",
        "mensaje": "Sin descanso, sin excusas.",
        "link_url": "https://example.com/cumbre-athletics",
        "monto_pagado": 1200,
    },
    {
        "nombre_marca": "Claro Legal",
        "logo_url": "https://placehold.co/128x128/c7d0dc/111111?text=CLR",
        "color_hex": "#c7d0dc",
        "skin_id": "principiante",
        "categoria": "Servicios",
        "mensaje": None,
        "link_url": "https://example.com/claro-legal",
        "monto_pagado": 800,
    },
    {
        "nombre_marca": "Brisa Café",
        "logo_url": "https://placehold.co/128x128/ff8a4d/111111?text=BRC",
        "color_hex": "#ff8a4d",
        "skin_id": "amateur",
        "categoria": "Comida y Bebida",
        "mensaje": "Despierta con nosotros.",
        "link_url": "https://example.com/brisa-cafe",
        "monto_pagado": 650,
    },
    {
        "nombre_marca": "Circuito Byte",
        "logo_url": "https://placehold.co/128x128/00eaff/111111?text=CBT",
        "color_hex": "#00eaff",
        "skin_id": "elite",
        "categoria": "Tecnología",
        "mensaje": "Optimizado para ganar.",
        "link_url": "https://example.com/circuito-byte",
        "monto_pagado": 500,
    },
    {
        "nombre_marca": "Trazo Estudio",
        "logo_url": "https://placehold.co/128x128/9a9a9a/111111?text=TRZ",
        "color_hex": "#9a9a9a",
        "skin_id": "noob",
        "categoria": "Otro",
        "mensaje": "Todavía dibujando mis ataques.",
        "link_url": "https://example.com/trazo-estudio",
        "monto_pagado": 300,
    },
    {
        "nombre_marca": "Rincón Mascotas",
        "logo_url": "https://placehold.co/128x128/4ddc8a/111111?text=RCN",
        "color_hex": "#4ddc8a",
        "skin_id": "principiante",
        "categoria": "Servicios",
        "mensaje": "Ladridos de advertencia.",
        "link_url": "https://example.com/rincon-mascotas",
        "monto_pagado": 220,
    },
]


def run():
    db = SessionLocal()
    try:
        existentes = {n for (n,) in db.query(Jefe.nombre_marca).all()}
        nuevos = [m for m in MARCAS_EXTRA if m["nombre_marca"] not in existentes]
        if not nuevos:
            print("Las marcas extra ya existen, no se insertó nada.")
            return

        for marca in nuevos:
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
                es_top1=False,
                activo=True,
            )
            db.add(jefe)
        db.commit()
        print(f"Insertados {len(nuevos)} jefes extra.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
