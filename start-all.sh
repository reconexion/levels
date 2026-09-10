#!/usr/bin/env bash
# Arranca el backend (FastAPI) y el frontend (Vite) de 10 Levels.
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/10levels_api"
WEB_DIR="$ROOT/10levels"

# --- Backend ---
if lsof -ti :8000 >/dev/null 2>&1; then
  echo "Backend: ya hay algo escuchando en :8000, lo dejo como está."
else
  if [ ! -x "$API_DIR/.venv/bin/uvicorn" ]; then
    echo "Backend: no encuentro $API_DIR/.venv — crea el entorno primero:"
    echo "  cd $API_DIR && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && cp .env.example .env && python seed.py"
    exit 1
  fi
  (cd "$API_DIR" && nohup .venv/bin/uvicorn app.main:app --port 8000 > uvicorn.log 2>&1 & echo $! > .uvicorn.pid)
  sleep 1
  echo "Backend arrancado (PID $(cat "$API_DIR/.uvicorn.pid")) -> http://localhost:8000 (log: $API_DIR/uvicorn.log)"
fi

# --- Frontend ---
if lsof -ti :5173 >/dev/null 2>&1; then
  echo "Frontend: ya hay algo escuchando en :5173 (p.ej. tu IDE), lo dejo como está."
else
  (cd "$WEB_DIR" && nohup npm run dev -- --port 5173 --strictPort > vite.log 2>&1 & echo $! > .vite.pid)
  sleep 2
  echo "Frontend arrancado (PID $(cat "$WEB_DIR/.vite.pid")) -> http://localhost:5173 (log: $WEB_DIR/vite.log)"
fi

echo "Listo. Abre http://localhost:5173"
