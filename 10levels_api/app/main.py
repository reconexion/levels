from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import combate, jefes, pagos, stats, webhooks

app = FastAPI(title="10 Levels API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jefes.router)
app.include_router(pagos.router)
app.include_router(webhooks.router)
app.include_router(combate.router)
app.include_router(stats.router)


@app.get("/health")
def health():
    return {"status": "ok"}
