import { ArrowRight, Flash, Heart, Trophy01, Zap } from '@untitledui/icons'
import { fetchLeaderboard, postLeaderboard } from '../api'
import { Avatar } from './base/avatar/avatar'
import { Badge } from './base/badges/badges'
import { Button } from './base/buttons/button'
import { Input } from './base/input/input'
import { bossTierNameForMonto } from '../game/bossTier'
import { WEAPON_LEVELS, getPlayerMaxHp, nextUpgradeCost } from '../game/progression'
import { colorForTag } from '../utils/color'
import { useLocalStorage } from '../utils/useLocalStorage'
import { useState } from 'react'

const TIER_BADGE_COLOR = {
  Noob: 'gray',
  Principiante: 'gray',
  Amateur: 'blue',
  Competente: 'blue',
  Avanzado: 'success',
  Experto: 'success',
  Élite: 'purple',
  Maestro: 'warning',
  Leyenda: 'pink',
  PRO: 'brand',
}

// Rank 1/2/3 get a medal treatment; everyone else gets a plain numbered circle.
const MEDAL_STYLE = [
  { ring: 'ring-utility-yellow-300', bg: 'bg-utility-yellow-50', text: 'text-utility-yellow-700', emoji: '🥇' },
  { ring: 'ring-utility-slate-300', bg: 'bg-utility-slate-50', text: 'text-utility-slate-700', emoji: '🥈' },
  { ring: 'ring-utility-orange-300', bg: 'bg-utility-orange-50', text: 'text-utility-orange-700', emoji: '🥉' },
]

function formatMonto(monto) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(monto)
}

function StatPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-tertiary px-2 py-1 text-xs font-medium text-secondary">
      <Icon className="size-3.5 text-fg-quaternary" />
      {children}
    </span>
  )
}

function RankBadge({ rank }) {
  const medal = MEDAL_STYLE[rank - 1]
  if (!medal) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-tertiary text-sm font-bold text-tertiary">
        {rank}
      </span>
    )
  }
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 ${medal.bg} ${medal.text} ${medal.ring} ${rank === 1 ? 'rank-crown' : ''}`}
      title={`Puesto ${rank}`}
    >
      {medal.emoji}
    </span>
  )
}

function JefesSkeleton() {
  return (
    <ul className="flex w-full flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-4 rounded-xl border border-secondary bg-secondary p-4 shadow-sm">
          <div className="skeleton-shimmer size-8 shrink-0 rounded-full" />
          <div className="skeleton-shimmer size-14 shrink-0 rounded-[10px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="skeleton-shimmer h-4 w-40 rounded-md" />
            <div className="skeleton-shimmer h-3 w-24 rounded-md" />
            <div className="skeleton-shimmer h-5 w-full max-w-xs rounded-md" />
          </div>
          <div className="skeleton-shimmer h-9 w-24 shrink-0 rounded-lg" />
        </li>
      ))}
    </ul>
  )
}

export default function BossMenu({
  jefes,
  loading,
  error,
  onRetry,
  onSelectJefe,
  onPatrocinar,
  points,
  weaponLevel,
  onUpgradeWeapon,
  jefesVencidosTotal,
  vencioTop1,
  stats,
}) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState(null)
  const [leaderboardError, setLeaderboardError] = useState(null)
  const [nombre3, setNombre3] = useLocalStorage('10levels:nombre3', '')
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  const upgradeCost = nextUpgradeCost(weaponLevel)
  const canUpgrade = upgradeCost != null && points >= upgradeCost
  const nextMaxHp = upgradeCost == null ? null : getPlayerMaxHp(weaponLevel + 1)

  const maxHpVisible = jefes.reduce((max, j) => Math.max(max, j.hp_max), 1)
  const misTres = nombre3.trim().toUpperCase()

  const openLeaderboard = async () => {
    setShowLeaderboard(true)
    setLeaderboardError(null)
    try {
      const data = await fetchLeaderboard()
      setLeaderboard(data)
    } catch {
      setLeaderboardError('No se pudo cargar el leaderboard.')
    }
  }

  const handleSaveScore = async (e) => {
    e.preventDefault()
    if (nombre3.trim().length !== 3) return
    setSaveState('saving')
    try {
      await postLeaderboard({
        nombre3Letras: nombre3.trim().toUpperCase(),
        jefesVencidosTotal,
        vencioTop1,
      })
      setSaveState('saved')
      if (showLeaderboard) {
        fetchLeaderboard().then(setLeaderboard).catch(() => {})
      }
    } catch {
      setSaveState('error')
    }
  }

  const maxLeaderboardScore = leaderboard?.length
    ? Math.max(...leaderboard.map((e) => e.jefes_vencidos_total), 1)
    : 1

  return (
    <div className="min-h-svh bg-primary px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <header className="animate-in fade-in slide-in-from-top-4 flex flex-col items-center gap-3 text-center duration-700">
          <h1 className="text-display-sm font-semibold text-brand-secondary">10 LEVELS</h1>
          <p className="mt-1 text-md text-tertiary">Elige un jefe patrocinado y reta a ver quién es más fuerte.</p>
          {stats && (
            <p className="text-sm text-quaternary">
              {stats.jugadores_activos_estimado} jugadores activos · {formatMonto(stats.monto_total_recaudado)}{' '}
              recaudados
            </p>
          )}
        </header>

        <section className="cta-sponsor animate-in fade-in slide-in-from-bottom-2 relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border-2 border-utility-brand-300 bg-secondary p-5 shadow-md duration-500">
          <div aria-hidden className="cta-glow pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-solid text-white shadow-xs-skeuomorphic">
              <Trophy01 className="size-5" />
            </span>
            <div className="flex flex-col">
              <strong className="text-md text-primary">
                {stats?.jefe_top1_actual ? `${stats.jefe_top1_actual.nombre_marca} es el jefe #1` : 'Nadie es el jefe #1 todavía'}
              </strong>
              <span className="text-sm text-tertiary">
                {stats?.jefe_top1_actual
                  ? `Pagó ${formatMonto(stats.jefe_top1_actual.monto_pagado)} — supéralo y toma su lugar.`
                  : 'Sé la primera marca en patrocinar un jefe.'}
              </span>
            </div>
          </div>
          <Button
            className="cta-btn-pulse relative z-10"
            color="primary"
            size="lg"
            iconLeading={Trophy01}
            onClick={onPatrocinar}
          >
            {stats?.jefe_top1_actual ? 'Supéralo y sé el jefe #1' : 'Sé el primer jefe #1'}
          </Button>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-2 flex w-full flex-wrap items-center gap-6 rounded-xl border border-secondary bg-secondary p-5 shadow-sm duration-500">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Puntos</span>
            <strong className="text-lg text-primary">{points}</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Arma</span>
            <strong className="text-lg text-primary">{WEAPON_LEVELS[weaponLevel].name}</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Vida máxima</span>
            <strong className="flex items-center gap-1 text-lg text-primary">
              <Heart className="size-4 text-error-primary" />
              {getPlayerMaxHp(weaponLevel)}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Jefes vencidos (sesión)</span>
            <strong className="text-lg text-primary">{jefesVencidosTotal}</strong>
          </div>
          <Button className="ml-auto" color="primary" isDisabled={!canUpgrade} onClick={onUpgradeWeapon}>
            {upgradeCost == null
              ? 'Arma al máximo'
              : `Mejorar arma (${upgradeCost} pts) → ${nextMaxHp} HP`}
          </Button>
        </section>

        {loading && <JefesSkeleton />}
        {error && (
          <div className="flex flex-col items-center gap-3 text-error-primary">
            <p>{error}</p>
            <Button color="secondary" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        )}

        {!loading && !error && (
          <ul className="flex w-full flex-col gap-3">
            {jefes.map((jefe, i) => {
              const tierName = bossTierNameForMonto(jefe.monto_pagado)
              const hpPct = Math.max(4, Math.round((jefe.hp_max / maxHpVisible) * 100))
              return (
                <li
                  key={jefe.id}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className={
                    'ranked-row group relative flex items-center gap-4 rounded-xl border bg-secondary p-4 pt-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg' +
                    (jefe.es_top1 ? ' border-utility-yellow-300' : ' border-secondary')
                  }
                >
                  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div
                      className="absolute inset-0 opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.12]"
                      style={{ background: `linear-gradient(120deg, ${jefe.color_hex}, transparent 70%)` }}
                    />
                  </div>

                  <RankBadge rank={i + 1} />

                  {jefe.es_top1 && (
                    <Badge className="absolute top-0 left-14 z-10" color="warning" size="sm">
                      <span className="animate-pulse">★</span>&nbsp;TOP 1
                    </Badge>
                  )}

                  <div
                    className="relative z-10 shrink-0 rounded-[10px] p-0.5"
                    style={{ background: jefe.color_hex }}
                  >
                    <Avatar src={jefe.logo_url} alt={jefe.nombre_marca} size="xl" rounded={false} />
                  </div>

                  <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="truncate text-md" style={{ color: jefe.color_hex }}>
                        {jefe.nombre_marca}
                      </strong>
                      <Badge color={TIER_BADGE_COLOR[tierName] ?? 'gray'} size="sm">
                        {tierName}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-tertiary">
                      {formatMonto(jefe.monto_pagado)} pagados
                    </span>
                    {jefe.mensaje && <p className="truncate text-sm text-tertiary italic">“{jefe.mensaje}”</p>}
                    <div className="flex flex-wrap gap-1.5">
                      <StatPill icon={Heart}>{jefe.hp_max} HP</StatPill>
                      <StatPill icon={Zap}>{jefe.danio_por_golpe} daño</StatPill>
                      <StatPill icon={Flash}>cada {jefe.frecuencia_ataque_segundos}s</StatPill>
                    </div>
                    <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-tertiary">
                      <div
                        className="rank-bar-fill h-full rounded-full"
                        style={{ width: `${hpPct}%`, background: jefe.color_hex }}
                      />
                    </div>
                  </div>

                  <Button
                    className="relative z-10"
                    color="primary"
                    iconTrailing={ArrowRight}
                    onClick={() => onSelectJefe(jefe)}
                  >
                    Retar
                  </Button>
                </li>
              )
            })}
            {jefes.length === 0 && <p className="text-center text-tertiary">Todavía no hay jefes activos.</p>}
          </ul>
        )}

        <section className="flex w-full flex-col gap-4 rounded-xl border border-secondary bg-secondary p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-secondary">Leaderboard</h2>
            <Button color="tertiary" size="sm" onClick={openLeaderboard}>
              {showLeaderboard ? 'Actualizar' : 'Ver top 10'}
            </Button>
          </div>

          {showLeaderboard && (
            <>
              {leaderboardError && <p className="text-error-primary">{leaderboardError}</p>}
              {leaderboard && leaderboard.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="hidden grid-cols-[2rem_2.25rem_1fr_auto] items-center gap-3 px-2 text-xs tracking-wide text-quaternary uppercase sm:grid">
                    <span>#</span>
                    <span />
                    <span>Jugador</span>
                    <span>Jefes vencidos</span>
                  </div>
                  {leaderboard.map((entry, i) => {
                    const esYo = misTres.length === 3 && entry.nombre_3_letras === misTres
                    const barPct = Math.max(6, Math.round((entry.jefes_vencidos_total / maxLeaderboardScore) * 100))
                    return (
                      <div
                        key={entry.id}
                        style={{ animationDelay: `${i * 60}ms` }}
                        className={
                          'ranked-row grid grid-cols-[2rem_2.25rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-200 sm:grid-cols-[2rem_2.25rem_1fr_auto]' +
                          (esYo ? ' bg-brand-secondary ring-1 ring-brand' : i % 2 === 0 ? ' bg-primary/40' : '')
                        }
                      >
                        <RankBadge rank={i + 1} />
                        <span
                          aria-hidden
                          className="flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: colorForTag(entry.nombre_3_letras) }}
                        >
                          {entry.nombre_3_letras}
                        </span>
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-primary">{entry.nombre_3_letras}</span>
                            {esYo && (
                              <Badge color="brand" size="sm">
                                Tú
                              </Badge>
                            )}
                            {entry.vencio_top1 && (
                              <Badge color="warning" size="sm">
                                ★ TOP 1
                              </Badge>
                            )}
                          </div>
                          <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-tertiary">
                            <div
                              className="rank-bar-fill h-full rounded-full bg-brand-solid"
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap text-tertiary">
                          {entry.jefes_vencidos_total} jefes
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              {leaderboard && leaderboard.length === 0 && (
                <p className="text-tertiary">Todavía no hay puntuaciones.</p>
              )}
            </>
          )}

          <form className="flex flex-col gap-2 border-t border-secondary pt-4" onSubmit={handleSaveScore}>
            <div className="flex items-end gap-2">
              <Input
                label="Guarda tu puntuación (3 letras)"
                maxLength={3}
                value={nombre3}
                onChange={(value) => {
                  setNombre3(value.replace(/[^a-zA-Z]/g, '').toUpperCase())
                  setSaveState('idle')
                }}
                placeholder="ABC"
                wrapperClassName="w-28"
              />
              <Button type="submit" color="primary" isDisabled={nombre3.length !== 3 || saveState === 'saving'}>
                {saveState === 'saving' ? 'Guardando…' : 'Guardar'}
              </Button>
            </div>
            {saveState === 'saved' && <p className="text-sm text-success-primary">¡Guardado!</p>}
            {saveState === 'error' && <p className="text-sm text-error-primary">No se pudo guardar, intenta de nuevo.</p>}
          </form>
        </section>
      </div>
    </div>
  )
}
