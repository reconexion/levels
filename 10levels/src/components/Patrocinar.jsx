import { AlertTriangle, ArrowLeft, CheckCircle, CurrencyDollarCircle } from '@untitledui/icons'
import { useEffect, useRef, useState } from 'react'
import { crearCheckout, fetchJefe } from '../api'
import { Button } from './base/buttons/button'
import { Input } from './base/input/input'
import { BOSS_STYLES } from '../game/bossSkins'

const POLL_MS = 2000
const POLL_MAX_TRIES = 20 // ~40s antes de mostrar el aviso de "está tardando"

function formatMonto(monto) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(monto)
}

export default function Patrocinar({ stats, onBack }) {
  const [nombreMarca, setNombreMarca] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [colorHex, setColorHex] = useState('#f97316')
  const [skinId, setSkinId] = useState(BOSS_STYLES[0].id)
  const [mensaje, setMensaje] = useState('')
  const [montoDeseado, setMontoDeseado] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  // Estado de retorno desde Stripe Checkout (?patrocinio=exito|cancelado&jefe_id=...),
  // leído una sola vez al montar — igual que App.jsx hace con `screen`.
  const [resultadoPago, setResultadoPago] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const tipo = params.get('patrocinio')
    const jefeId = params.get('jefe_id')
    return tipo ? { tipo, jefeId } : null
  })
  const [jefeConfirmado, setJefeConfirmado] = useState(null)
  const [tardando, setTardando] = useState(false)
  const triesRef = useRef(0)

  useEffect(() => {
    if (resultadoPago) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [resultadoPago])

  useEffect(() => {
    if (resultadoPago?.tipo !== 'exito' || !resultadoPago.jefeId) return undefined
    let alive = true
    const id = setInterval(async () => {
      triesRef.current += 1
      try {
        const jefe = await fetchJefe(resultadoPago.jefeId)
        if (alive && jefe.activo) {
          setJefeConfirmado(jefe)
          clearInterval(id)
          return
        }
      } catch {
        // Sigue inactivo (el webhook todavía no llega) — seguimos reintentando.
      }
      if (triesRef.current >= POLL_MAX_TRIES) {
        setTardando(true)
        clearInterval(id)
      }
    }, POLL_MS)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [resultadoPago])

  const precioMinimo = stats?.jefe_top1_actual?.monto_pagado ?? 0
  const stripeListo = stats?.stripe_configurado ?? false

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const monto = Number(montoDeseado)
    if (!nombreMarca.trim() || !logoUrl.trim()) {
      setError('Rellena el nombre de tu marca y la URL de tu logo.')
      return
    }
    if (!monto || monto <= precioMinimo) {
      setError(`Tu monto debe superar ${formatMonto(precioMinimo)} para ser el jefe #1.`)
      return
    }
    setEnviando(true)
    try {
      const { checkout_url } = await crearCheckout({
        nombreMarca: nombreMarca.trim(),
        logoUrl: logoUrl.trim(),
        colorHex,
        skinId,
        mensaje: mensaje.trim(),
        montoDeseado: monto,
      })
      window.location.href = checkout_url
    } catch (err) {
      setError(err.message || 'No se pudo iniciar el pago.')
      setEnviando(false)
    }
  }

  const volverYLimpiar = () => {
    setResultadoPago(null)
    setJefeConfirmado(null)
    setTardando(false)
    onBack()
  }

  // ---- Pantalla de resultado tras volver de Stripe Checkout ----
  if (resultadoPago?.tipo === 'exito') {
    return (
      <div className="min-h-svh bg-primary px-4 py-10 text-primary sm:px-8">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
          {jefeConfirmado ? (
            <>
              <CheckCircle className="size-12 text-fg-success-primary" />
              <h1 className="text-display-xs font-semibold text-brand-secondary">¡Ya eres el jefe #1!</h1>
              <p className="text-tertiary">
                <strong style={{ color: jefeConfirmado.color_hex }}>{jefeConfirmado.nombre_marca}</strong> quedó
                activo con {formatMonto(jefeConfirmado.monto_pagado)} pagados. Ya aparece en la lista de jefes.
              </p>
            </>
          ) : (
            <>
              <div className="skeleton-shimmer size-12 rounded-full" />
              <h1 className="text-display-xs font-semibold text-brand-secondary">Confirmando tu pago…</h1>
              <p className="text-tertiary">
                Stripe ya recibió el pago; en cuanto llegue la confirmación (webhook) tu jefe se activa solo.
              </p>
              {tardando && (
                <p className="rounded-lg bg-warning-primary px-3 py-2 text-sm text-warning-primary">
                  Esto está tardando más de lo normal. Si estás en desarrollo local, revisa que{' '}
                  <code>stripe listen --forward-to localhost:8000/api/webhooks/stripe</code> esté corriendo.
                </p>
              )}
            </>
          )}
          <Button color="primary" onClick={volverYLimpiar}>
            Volver al menú
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-primary px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6">
        <Button color="tertiary" size="sm" iconLeading={ArrowLeft} onClick={onBack} className="self-start">
          Volver
        </Button>

        <header className="animate-in fade-in slide-in-from-top-4 flex flex-col gap-2 duration-500">
          <h1 className="text-display-xs font-semibold text-brand-secondary">Conviértete en el jefe #1</h1>
          <p className="text-tertiary">
            {stats?.jefe_top1_actual ? (
              <>
                <strong style={{ color: stats.jefe_top1_actual.color_hex }}>
                  {stats.jefe_top1_actual.nombre_marca}
                </strong>{' '}
                pagó <strong>{formatMonto(precioMinimo)}</strong> por el puesto #1. Paga más para quitárselo.
              </>
            ) : (
              'Todavía nadie ha pagado por ser el jefe #1 — sé el primero.'
            )}
          </p>
        </header>

        {resultadoPago?.tipo === 'cancelado' && (
          <p className="rounded-lg bg-warning-primary px-3 py-2 text-sm text-warning-primary">
            Pago cancelado. Puedes intentarlo de nuevo cuando quieras.
          </p>
        )}

        {!stripeListo && (
          <div className="flex items-start gap-2 rounded-lg border border-utility-yellow-300 bg-utility-yellow-50 px-3 py-2.5 text-sm text-utility-yellow-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Los pagos todavía no están activos en este entorno (falta configurar Stripe en el backend). Puedes
              rellenar el formulario, pero el cobro no se procesará hasta que se agreguen las claves.
            </span>
          </div>
        )}

        <form className="flex flex-col gap-4 rounded-xl border border-secondary bg-secondary p-5 shadow-sm" onSubmit={handleSubmit}>
          <Input
            label="Nombre de tu marca"
            placeholder="Cyberdyne Sodas"
            value={nombreMarca}
            onChange={setNombreMarca}
            isRequired
          />
          <Input
            label="URL de tu logo"
            hint="Idealmente cuadrado (128×128 o más)."
            placeholder="https://..."
            value={logoUrl}
            onChange={setLogoUrl}
            isRequired
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Color de marca</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorHex}
                onChange={(e) => setColorHex(e.target.value)}
                className="size-10 cursor-pointer rounded-lg border border-secondary bg-transparent p-1"
                aria-label="Selector de color"
              />
              <Input
                value={colorHex}
                onChange={setColorHex}
                wrapperClassName="flex-1"
                pattern="^#[0-9a-fA-F]{6}$"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Skin de tu jefe</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {BOSS_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSkinId(style.id)}
                  className={
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-all duration-150' +
                    (skinId === style.id
                      ? ' border-brand bg-brand-secondary ring-2 ring-brand'
                      : ' border-secondary bg-primary hover:border-brand')
                  }
                >
                  <span
                    className="size-8 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${style.colorA}, ${style.colorB})` }}
                  />
                  <span className="text-xs leading-tight text-secondary">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Mensaje de tu jefe (opcional)"
            hint="Se muestra en su tarjeta del menú y al iniciar la pelea contra él."
            maxLength={140}
            placeholder="¿Te atreves a retarme?"
            value={mensaje}
            onChange={setMensaje}
          />
          <Input
            label={`Monto a pagar (supera ${formatMonto(precioMinimo)})`}
            type="number"
            icon={CurrencyDollarCircle}
            min={precioMinimo + 1}
            step="1"
            placeholder={String(Math.max(50, precioMinimo + 1))}
            value={montoDeseado}
            onChange={setMontoDeseado}
            isRequired
          />

          {error && <p className="text-sm text-error-primary">{error}</p>}

          <Button type="submit" color="primary" isLoading={enviando} isDisabled={enviando}>
            Pagar y convertirme en el jefe #1
          </Button>
        </form>
      </div>
    </div>
  )
}
