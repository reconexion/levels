#!/usr/bin/env bash
# Detiene lo que start-all.sh arrancó (identificado por PID guardado, no mata procesos ajenos
# como el servidor de Vite de tu IDE si tú no lo arrancaste con start-all.sh).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/10levels_api"
WEB_DIR="$ROOT/10levels"

stop_pidfile() {
  local pidfile="$1" label="$2"
  if [ -f "$pidfile" ]; then
    local pid
    pid="$(cat "$pidfile")"
    if kill "$pid" 2>/dev/null; then
      echo "$label detenido (PID $pid)."
    else
      echo "$label: el proceso $pid ya no existía."
    fi
    rm -f "$pidfile"
  else
    echo "$label: no lo arrancó start-all.sh (no hay .pid), no toco nada."
  fi
}

stop_pidfile "$API_DIR/.uvicorn.pid" "Backend"
stop_pidfile "$WEB_DIR/.vite.pid" "Frontend"

echo "Si algo sigue escuchando en :8000 o :5173 y quieres forzarlo:"
echo "  kill \$(lsof -ti :8000)   # backend"
echo "  kill \$(lsof -ti :5173)   # frontend (¡cuidado si lo maneja tu IDE!)"
