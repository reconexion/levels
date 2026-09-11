import { ArrowRight, Flash, Heart, Trophy01, Users01, Zap } from '@untitledui/icons'
import { useState } from 'react'
import { Avatar } from './base/avatar/avatar'
import { Badge } from './base/badges/badges'
import { Button } from './base/buttons/button'
import BossSkinPreview from './BossSkinPreview'
import Pagination from './Pagination'
import { bossStyleForSkinId } from '../game/bossSkins'
import { bossTierNameForMonto } from '../game/bossTier'
import { WEAPON_LEVELS, getPlayerMaxHp, nextUpgradeCost } from '../game/progression'

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

const JEFES_POR_PAGINA = 8

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
        <li key={i} className="glass-row flex items-center gap-4 rounded-xl border border-secondary p-4 shadow-sm">
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
  stats,
}) {
  const [page, setPage] = useState(1)

  const upgradeCost = nextUpgradeCost(weaponLevel)
  const canUpgrade = upgradeCost != null && points >= upgradeCost
  const nextMaxHp = upgradeCost == null ? null : getPlayerMaxHp(weaponLevel + 1)

  const maxHpVisible = jefes.reduce((max, j) => Math.max(max, j.hp_max), 1)
  const totalPages = Math.max(1, Math.ceil(jefes.length / JEFES_POR_PAGINA))
  // Jefes can arrive/refresh after `page` was set (e.g. a payment confirms) — clamp
  // here instead of in an effect so a stale page number never renders empty.
  const currentPage = Math.min(page, totalPages)
  const pageJefes = jefes.slice((currentPage - 1) * JEFES_POR_PAGINA, currentPage * JEFES_POR_PAGINA)

  return (
    <div className="min-h-svh px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <header className="animate-in fade-in slide-in-from-top-4 flex flex-col items-center gap-3 text-center duration-700">
          <h1 className="text-display-sm font-semibold text-brand-secondary">10 LEVELS</h1>
          <p className="mt-1 text-md text-tertiary">Elige un jefe patrocinado y reta a ver quién es más fuerte.</p>
          {stats && (
            <span className="inline-flex items-center gap-1.5 text-sm text-quaternary">
              <Users01 className="size-4" />
              {stats.jugadores_activos_estimado} jugadores activos
            </span>
          )}
        </header>

        <section className="cta-sponsor glass-card animate-in fade-in slide-in-from-bottom-2 relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border-2 border-utility-brand-400/50 p-5 shadow-lg shadow-black/40 duration-500">
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
            {stats?.jefe_top1_actual ? 'Reclamar Rango' : 'Sé el primer jefe #1'}
          </Button>
        </section>

        <section className="glass-card animate-in fade-in slide-in-from-bottom-2 flex w-full flex-wrap items-center gap-6 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30 duration-500">
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

        <section className="glass-card flex w-full flex-col gap-4 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-secondary">Jefes patrocinados</h2>
            {!loading && !error && jefes.length > 0 && (
              <span className="text-sm text-quaternary">{jefes.length} activos</span>
            )}
          </div>

          {loading && <JefesSkeleton />}
          {error && (
            <div className="flex flex-col items-center gap-3 py-6 text-error-primary">
              <p>{error}</p>
              <Button color="secondary" onClick={onRetry}>
                Reintentar
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              <ul className="flex w-full flex-col gap-3">
                {pageJefes.map((jefe, i) => {
                  const rank = (currentPage - 1) * JEFES_POR_PAGINA + i + 1
                  const tierName = bossTierNameForMonto(jefe.monto_pagado)
                  const hpPct = Math.max(4, Math.round((jefe.hp_max / maxHpVisible) * 100))
                  return (
                    <li
                      key={jefe.id}
                      style={{ animationDelay: `${i * 70}ms` }}
                      className={
                        'ranked-row glass-row group relative flex items-center gap-4 rounded-xl border p-4 pt-6 shadow-md shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg' +
                        (jefe.es_top1 ? ' border-utility-yellow-300' : ' border-secondary')
                      }
                    >
                      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                        <div
                          className="absolute inset-0 opacity-[0.06] transition-opacity duration-300 group-hover:opacity-[0.12]"
                          style={{ background: `linear-gradient(120deg, ${jefe.color_hex}, transparent 70%)` }}
                        />
                      </div>

                      <RankBadge rank={rank} />

                      {jefe.es_top1 && (
                        <Badge className="absolute top-0 left-14 z-10" color="warning" size="sm">
                          <span className="animate-pulse">★</span>&nbsp;TOP 1
                        </Badge>
                      )}

                      <div className="relative z-10 flex shrink-0 flex-col items-center gap-1.5">
                        <div
                          className="rounded-[10px] p-0.5"
                          style={{ background: jefe.color_hex }}
                        >
                          <Avatar src={jefe.logo_url} alt={jefe.nombre_marca} size="xl" rounded={false} />
                        </div>
                        <BossSkinPreview jefe={jefe} size={56} />
                        <span className="text-[10px] leading-none text-quaternary">
                          {bossStyleForSkinId(jefe.skin_id).name}
                        </span>
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
                {jefes.length === 0 && <p className="py-6 text-center text-tertiary">Todavía no hay jefes activos.</p>}
              </ul>

              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
