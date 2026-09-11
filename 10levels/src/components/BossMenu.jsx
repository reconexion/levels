import { Heart, Trophy01, Users01 } from '@untitledui/icons'
import { useState } from 'react'
import { Button } from './base/buttons/button'
import BossCard from './BossCard'
import Pagination from './Pagination'
import { WEAPON_LEVELS, getPlayerMaxHp, nextUpgradeCost } from '../game/progression'

const JEFES_POR_PAGINA = 8

function formatMonto(monto) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(monto)
}

function JefesSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="skeleton-shimmer w-full rounded-2xl" style={{ aspectRatio: '342 / 196' }} />
      ))}
    </div>
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
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {pageJefes.map((jefe, i) => (
                  <div key={jefe.id} className="ranked-row" style={{ animationDelay: `${i * 70}ms` }}>
                    <BossCard
                      jefe={jefe}
                      rank={(currentPage - 1) * JEFES_POR_PAGINA + i + 1}
                      maxHpVisible={maxHpVisible}
                      onSelect={onSelectJefe}
                    />
                  </div>
                ))}
                {jefes.length === 0 && (
                  <p className="col-span-full py-6 text-center text-tertiary">Todavía no hay jefes activos.</p>
                )}
              </div>

              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
