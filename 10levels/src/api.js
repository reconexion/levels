const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// FastAPI error bodies are `{ "detail": "..." }` — surface that message directly
// (e.g. "Tu monto debe superar $5,000...") instead of a generic status string.
async function parseErrorDetail(res) {
  try {
    const body = await res.json()
    return body?.detail ?? ''
  } catch {
    return res.text().catch(() => '')
  }
}

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const detail = await parseErrorDetail(res)
    const err = new Error(detail || `${res.status} ${res.statusText}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export function fetchJefes() {
  return request('/api/jefes')
}

export function fetchJefe(jefeId) {
  return request(`/api/jefes/${jefeId}`)
}

export function iniciarCombate({ jefeId, sesionId }) {
  return request('/api/combate/iniciar', {
    method: 'POST',
    body: JSON.stringify({ jefe_id: jefeId, sesion_id: sesionId }),
  })
}

export function atacar({ jefeId, sesionId, danioInfligido }) {
  return request('/api/combate/atacar', {
    method: 'POST',
    body: JSON.stringify({ jefe_id: jefeId, sesion_id: sesionId, danio_infligido: danioInfligido }),
  })
}

export function fetchStats() {
  return request('/api/stats')
}

export function crearCheckout({ nombreMarca, logoUrl, colorHex, skinId, categoria, mensaje, linkUrl, montoDeseado }) {
  return request('/api/pagos/crear-checkout', {
    method: 'POST',
    body: JSON.stringify({
      nombre_marca: nombreMarca,
      logo_url: logoUrl,
      color_hex: colorHex,
      skin_id: skinId,
      categoria,
      mensaje: mensaje || null,
      link_url: linkUrl || null,
      monto_deseado: montoDeseado,
    }),
  })
}

// Asks the backend to check the Checkout Session with Stripe directly and
// activate the jefe if it's paid — a fallback for when the
// checkout.session.completed webhook hasn't (yet, or ever) arrived.
export function confirmarPago(jefeId) {
  return request(`/api/pagos/confirmar/${jefeId}`, { method: 'POST' })
}
