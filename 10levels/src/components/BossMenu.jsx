import { Heart, SearchLg, Trophy01, Users01 } from '@untitledui/icons'
import { useState } from 'react'
import { Button } from './base/buttons/button'
import { Input } from './base/input/input'
import BossCard from './BossCard'
import Pagination from './Pagination'
import PlayerPreview from './PlayerPreview'
import { CATEGORIAS } from '../game/categorias'
import { WEAPON_LEVELS, getPlayerMaxHp, isWeaponMaxed, upgradeCostFor } from '../game/progression'
import logoSrc from '../assets/logologo.png'

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
    <div className="flex w-full flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton-shimmer h-44 w-full rounded-2xl" />
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
  bonusLevel,
  weaponSkinIndex,
  onUpgradeWeapon,
  jefesVencidosTotal,
  stats,
}) {
  const [page, setPage] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const maxed = isWeaponMaxed(weaponLevel)
  const upgradeCost = upgradeCostFor(weaponLevel, bonusLevel)
  const canUpgrade = points >= upgradeCost
  const currentMaxHp = getPlayerMaxHp(weaponLevel, bonusLevel)
  const nextMaxHp = maxed ? getPlayerMaxHp(weaponLevel, bonusLevel + 1) : getPlayerMaxHp(weaponLevel + 1, bonusLevel)

  const maxHpVisible = jefes.reduce((max, j) => Math.max(max, j.hp_max), 1)

  const termino = busqueda.trim().toLowerCase()
  const jefesFiltrados = jefes.filter((j) => {
    const coincideNombre = !termino || j.nombre_marca.toLowerCase().includes(termino)
    const coincideCategoria = !categoriaFiltro || j.categoria === categoriaFiltro
    return coincideNombre && coincideCategoria
  })

  // Jefes can arrive/refresh after `page` was set (e.g. a payment confirms, or a
  // filter shrinks the list) — clamp here instead of in an effect so a stale page
  // number never renders empty.
  const totalPages = Math.max(1, Math.ceil(jefesFiltrados.length / JEFES_POR_PAGINA))
  const currentPage = Math.min(page, totalPages)
  const pageJefes = jefesFiltrados.slice((currentPage - 1) * JEFES_POR_PAGINA, currentPage * JEFES_POR_PAGINA)

  return (
    <div className="min-h-svh px-4 py-10 text-primary sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <header className="animate-in fade-in slide-in-from-top-4 flex flex-col items-center gap-3 text-center duration-700">
          <div className="flex items-center gap-2">
            <span className="text-display-sm font-black text-brand-secondary">10</span>
            <img src={logoSrc} alt="Levels" className="h-8 sm:h-10" />
          </div>
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
                  ? `Pagó ${formatMonto(stats.jefe_top1_actual.monto_pagado)}. La marca que más paga es el jefe #1.`
                  : 'La marca que pague más será el jefe #1.'}
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
            {stats?.jefe_top1_actual ? 'Reclamar tu Rango' : 'Sé el primer jefe #1'}
          </Button>
        </section>

        <section className="glass-card animate-in fade-in slide-in-from-bottom-2 flex w-full flex-wrap items-center gap-6 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30 duration-500">
          <PlayerPreview weaponLevel={weaponLevel} weaponSkinIndex={weaponSkinIndex} />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Puntos</span>
            <strong className="text-lg text-primary">{points}</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Arma</span>
            <strong className="text-lg text-primary">
              {WEAPON_LEVELS[weaponLevel].name}
              {maxed && bonusLevel > 0 && <span className="text-brand-secondary"> +{bonusLevel}</span>}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Vida máxima</span>
            <strong className="flex items-center gap-1 text-lg text-primary">
              <Heart className="size-4 text-error-primary" />
              {currentMaxHp}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">Jefes vencidos (sesión)</span>
            <strong className="text-lg text-primary">{jefesVencidosTotal}</strong>
          </div>
          <Button className="ml-auto" color="primary" isDisabled={!canUpgrade} onClick={onUpgradeWeapon}>
            {maxed
              ? `Mejorar daño y vida (${upgradeCost} pts) → ${nextMaxHp} HP`
              : `Mejorar arma (${upgradeCost} pts) → ${nextMaxHp} HP`}
          </Button>
        </section>

        <section className="glass-card flex w-full flex-col gap-4 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-secondary">Jefes patrocinados</h2>
            {!loading && !error && jefes.length > 0 && (
              <span className="text-sm text-quaternary">
                {jefesFiltrados.length} de {jefes.length}
              </span>
            )}
          </div>

          {!loading && !error && jefes.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                icon={SearchLg}
                placeholder="Buscar una marca…"
                value={busqueda}
                onChange={(value) => {
                  setBusqueda(value)
                  setPage(1)
                }}
                wrapperClassName="flex-1"
              />
              <select
                value={categoriaFiltro}
                onChange={(e) => {
                  setCategoriaFiltro(e.target.value)
                  setPage(1)
                }}
                className="rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-brand sm:w-56"
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              <div className="flex w-full flex-col gap-4">
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
                {jefes.length === 0 && <p className="py-6 text-center text-tertiary">Todavía no hay jefes activos.</p>}
                {jefes.length > 0 && jefesFiltrados.length === 0 && (
                  <p className="py-6 text-center text-tertiary">Ninguna marca coincide con tu búsqueda.</p>
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
