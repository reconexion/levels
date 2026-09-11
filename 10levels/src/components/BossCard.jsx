import { ArrowRight, Coins01, Flash, Heart, LinkExternal01, Lock01, Zap } from '@untitledui/icons'
import { Avatar } from './base/avatar/avatar'
import { Badge } from './base/badges/badges'
import { Button } from './base/buttons/button'
import BossSkinPreview from './BossSkinPreview'
import RankBadge from './RankBadge'
import { formatLockRemaining, useLockRemaining } from '../game/bossLock'
import { shadeColorHex } from '../game/bossSkins'
import { bossTierNameForMonto, TIER_BADGE_COLOR } from '../game/bossTier'
import { categoriaEstiloFor, CATEGORIA_LABEL_KEY } from '../game/categorias'
import { useLanguage } from '../i18n/LanguageContext'

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

// The blob-shaped card background — same path/viewBox as the uiverse.io weather-card
// reference the design is based on, recolored per-jefe and stretched (via the parent's
// own width/height + preserveAspectRatio="none") into a long horizontal banner.
// Lives in its own overflow-hidden wrapper — nothing else on the card is clipped by it,
// so the avatar/skin badge below can safely spill past the card's edge.
function CardBlob({ id, colorA, colorB }) {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 342 175" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill={`url(#${id})`}
        d="M0 66.4396C0 31.6455 0 14.2484 11.326 5.24044C22.6519 -3.76754 39.6026 0.147978 73.5041 7.97901L307.903 62.1238C324.259 65.9018 332.436 67.7909 337.218 73.8031C342 79.8154 342 88.2086 342 104.995V131C342 151.742 342 162.113 335.556 168.556C329.113 175 318.742 175 298 175H44C23.2582 175 12.8873 175 6.44365 168.556C0 162.113 0 151.742 0 131V66.4396Z"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="128" x2="354.142" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor={colorA} />
          <stop offset="1" stopColor={colorB} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function BossCard({ jefe, rank, rewardPoints, maxHpVisible, onSelect, defeatedAt }) {
  const { t, lang } = useLanguage()
  const tierName = bossTierNameForMonto(jefe.monto_pagado)
  const colorB = shadeColorHex(jefe.color_hex, -42)
  const hpPct = Math.max(4, Math.round((jefe.hp_max / maxHpVisible) * 100))
  const { icon: CategoriaIcon, tint: categoriaTint } = categoriaEstiloFor(jefe.categoria)
  const lockRemaining = useLockRemaining(defeatedAt)
  const isLocked = lockRemaining > 0

  const nombreContent = (
    <>
      {jefe.nombre_marca}
      {jefe.link_url && <LinkExternal01 className="ml-1 inline size-4 -translate-y-0.5 opacity-70" />}
    </>
  )

  return (
    <div
      className={`boss-card group relative w-full rounded-2xl shadow-lg shadow-black/40 transition-transform duration-300 ${
        isLocked ? 'grayscale' : 'hover:-translate-y-1 hover:shadow-2xl'
      }`}
    >
      {/* Clipped background layer only — the blob art, scrim, hover glow, and category
          watermark live here so rounding the corners never crops anything that needs to
          spill past the edge (the avatar/skin badge below does). */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <CardBlob id={`boss-blob-${jefe.id}`} colorA={jefe.color_hex} colorB={colorB} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-black/35" aria-hidden="true" />
        {/* Category watermark — the one visible "the design changes per category" cue. */}
        <CategoriaIcon
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-16 size-28 -rotate-12 text-white opacity-[0.12]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.16), transparent 60%)' }}
        />
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/30">
          <div className="rank-bar-fill h-full" style={{ width: `${hpPct}%`, background: jefe.color_hex }} />
        </div>
        {isLocked && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[1px]"
          >
            <Lock01 className="size-9 text-white/80" />
          </div>
        )}
      </div>

      <div className="relative z-10 flex h-full flex-wrap items-center gap-4 p-4 text-white sm:flex-nowrap sm:p-5">
        <div className="flex shrink-0 items-center gap-2">
          <RankBadge rank={rank} />
          <div
            className="rounded-[10px] p-0.5"
            style={{ background: `linear-gradient(135deg, ${jefe.color_hex}, ${colorB})` }}
          >
            <Avatar
              src={jefe.logo_url}
              alt={jefe.nombre_marca}
              size="xl"
              rounded={false}
              badge={
                <div className="absolute -right-1.5 -bottom-1.5">
                  <BossSkinPreview jefe={jefe} size={26} />
                </div>
              }
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col">
          <p className="flex items-center gap-1 text-3xl leading-none font-black tracking-tight sm:text-4xl">
            <Heart className="size-5 text-utility-red-400 sm:size-6" />
            {Math.round(jefe.hp_max).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US')}
            <span className="ml-0.5 text-sm font-semibold text-white/70">HP</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {jefe.es_top1 && (
              <Badge color="warning" size="sm">
                <span className="animate-pulse">★</span>&nbsp;TOP 1
              </Badge>
            )}
            <Badge color={TIER_BADGE_COLOR[tierName] ?? 'gray'} size="sm">
              {t(tierName)}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-utility-orange-300">
              <Zap className="size-3" />
              {jefe.danio_por_golpe}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-utility-blue-300">
              <Flash className="size-3" />
              {jefe.frecuencia_ataque_segundos}s
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1 basis-40">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-xs font-medium text-white/60">
              {t('{amount} paid', { amount: formatMonto(jefe.monto_pagado, lang) })}
            </p>
            {jefe.categoria && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white/90"
                style={{ boxShadow: `inset 0 0 0 1px ${categoriaTint}55` }}
              >
                <CategoriaIcon className="size-2.5" style={{ color: categoriaTint }} />
                {t(CATEGORIA_LABEL_KEY[jefe.categoria] ?? jefe.categoria)}
              </span>
            )}
          </div>
          {jefe.link_url ? (
            <a
              href={jefe.link_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={t('Visit {name}’s page', { name: jefe.nombre_marca })}
              className="boss-name-link block truncate text-lg font-extrabold sm:text-xl"
              style={{ '--boss-accent': jefe.color_hex }}
            >
              {nombreContent}
            </a>
          ) : (
            <p className="truncate text-lg font-extrabold sm:text-xl">{nombreContent}</p>
          )}
          {jefe.mensaje && <p className="truncate text-xs text-white/70 italic">“{jefe.mensaje}”</p>}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          {isLocked ? (
            <Button
              size="sm"
              color="secondary"
              iconLeading={Lock01}
              isDisabled
              title={t('{name} was just defeated. Try again in {time}.', {
                name: jefe.nombre_marca,
                time: formatLockRemaining(lockRemaining),
              })}
            >
              {formatLockRemaining(lockRemaining)}
            </Button>
          ) : (
            <Button size="sm" color="primary" iconTrailing={ArrowRight} onClick={() => onSelect(jefe)}>
              {t('Challenge')}
            </Button>
          )}
          {!isLocked && rewardPoints > 0 && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold text-utility-yellow-300"
              title={t('Points earned for defeating this boss')}
            >
              <Coins01 className="size-3.5" />
              {t('+{points} pts', { points: rewardPoints })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
