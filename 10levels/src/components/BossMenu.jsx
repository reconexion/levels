import { Heart, SearchLg, Trophy01 } from '@untitledui/icons'
import { useState } from 'react'
import { Button } from './base/buttons/button'
import { Input } from './base/input/input'
import BossCard from './BossCard'
import Pagination from './Pagination'
import PlayerPreview from './PlayerPreview'
import { useLanguage } from '../i18n/LanguageContext'
import { CATEGORIAS, CATEGORIA_LABEL_KEY } from '../game/categorias'
import { WEAPON_LEVELS, getPlayerMaxHp, isWeaponMaxed, pointsForRank, upgradeCostFor } from '../game/progression'
import logoSrc from '../assets/logologo.png'

const JEFES_POR_PAGINA = 8

// currencyDisplay: 'code' always renders "USD 1,234" instead of a bare "$" — the same
// symbol Mexican pesos use, which is exactly the mismatch that confused sponsors when
// the page showed one currency label and Stripe Checkout charged in another.
function formatMonto(monto, lang) {
  return new Intl.NumberFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
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
  const { t, lang } = useLanguage()
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
          <img src={logoSrc} alt="Levels" className="h-9 sm:h-11" />
          <p className="mt-1 text-md text-tertiary">{t('Choose a sponsored boss and challenge them to see who is stronger.')}</p>
        </header>

        <section className="cta-sponsor glass-card animate-in fade-in slide-in-from-bottom-2 relative flex w-full flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border-2 border-utility-brand-400/50 p-5 shadow-lg shadow-black/40 duration-500">
          <div aria-hidden className="cta-glow pointer-events-none absolute inset-0" />
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-solid text-white shadow-xs-skeuomorphic">
              <Trophy01 className="size-5" />
            </span>
            <div className="flex flex-col">
              <strong className="text-md text-primary">
                {stats?.jefe_top1_actual
                  ? `${stats.jefe_top1_actual.nombre_marca} ${t('is the #1 boss')}`
                  : t('No one is the #1 boss yet')}
              </strong>
              <span className="text-sm text-tertiary">
                {stats?.jefe_top1_actual
                  ? t('Paid {amount}. The brand that pays the most is the #1 boss.', {
                      amount: formatMonto(stats.jefe_top1_actual.monto_pagado, lang),
                    })
                  : t('The brand that pays the most will be the #1 boss.')}
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
            {stats?.jefe_top1_actual ? t('Claim your Rank') : t('Be the first #1 boss')}
          </Button>
        </section>

        <section className="glass-card animate-in fade-in slide-in-from-bottom-2 flex w-full flex-wrap items-center gap-6 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30 duration-500">
          <PlayerPreview weaponLevel={weaponLevel} weaponSkinIndex={weaponSkinIndex} />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">{t('Points')}</span>
            <strong className="text-lg text-primary">{points}</strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">{t('Weapon')}</span>
            <strong className="text-lg text-primary">
              {WEAPON_LEVELS[weaponLevel].name}
              {maxed && bonusLevel > 0 && <span className="text-brand-secondary"> +{bonusLevel}</span>}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">{t('Max health')}</span>
            <strong className="flex items-center gap-1 text-lg text-primary">
              <Heart className="size-4 text-error-primary" />
              {currentMaxHp}
            </strong>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs tracking-wide text-quaternary uppercase">{t('Bosses defeated (session)')}</span>
            <strong className="text-lg text-primary">{jefesVencidosTotal}</strong>
          </div>
          <Button className="ml-auto" color="primary" isDisabled={!canUpgrade} onClick={onUpgradeWeapon}>
            {maxed
              ? t('Upgrade damage & health ({cost} pts) → {hp} HP', { cost: upgradeCost, hp: nextMaxHp })
              : t('Upgrade weapon ({cost} pts) → {hp} HP', { cost: upgradeCost, hp: nextMaxHp })}
          </Button>
        </section>

        <section className="glass-card flex w-full flex-col gap-4 rounded-xl border border-secondary p-5 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-secondary">{t('Sponsored bosses')}</h2>
            {!loading && !error && jefes.length > 0 && (
              <span className="text-sm text-quaternary">
                {t('{shown} of {total}', { shown: jefesFiltrados.length, total: jefes.length })}
              </span>
            )}
          </div>

          {!loading && !error && jefes.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                icon={SearchLg}
                placeholder={t('Search a brand…')}
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
                <option value="">{t('All categories')}</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(CATEGORIA_LABEL_KEY[cat])}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && <JefesSkeleton />}
          {error && (
            <div className="flex flex-col items-center gap-3 py-6 text-error-primary">
              <p>{t(error)}</p>
              <Button color="secondary" onClick={onRetry}>
                {t('Retry')}
              </Button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex w-full flex-col gap-4">
                {pageJefes.map((jefe, i) => {
                  // Global rank across the full (unfiltered) leaderboard — `jefes` arrives
                  // sorted by monto_pagado desc from the API — so the reward shown never
                  // shifts just because a search/category filter is active.
                  const globalRank = jefes.findIndex((j) => j.id === jefe.id) + 1
                  return (
                    <div key={jefe.id} className="ranked-row lazy-column" style={{ animationDelay: `${i * 70}ms` }}>
                      <BossCard
                        jefe={jefe}
                        rank={(currentPage - 1) * JEFES_POR_PAGINA + i + 1}
                        rewardPoints={pointsForRank(globalRank)}
                        maxHpVisible={maxHpVisible}
                        onSelect={onSelectJefe}
                      />
                    </div>
                  )
                })}
                {jefes.length === 0 && <p className="py-6 text-center text-tertiary">{t('No boss is active yet.')}</p>}
                {jefes.length > 0 && jefesFiltrados.length === 0 && (
                  <p className="py-6 text-center text-tertiary">{t('No brand matches your search.')}</p>
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
