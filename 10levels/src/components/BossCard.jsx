import { ArrowRight, Flash, LinkExternal01, Zap } from '@untitledui/icons'
import { Avatar } from './base/avatar/avatar'
import { Badge } from './base/badges/badges'
import { Button } from './base/buttons/button'
import BossSkinPreview from './BossSkinPreview'
import RankBadge from './RankBadge'
import { shadeColorHex } from '../game/bossSkins'
import { bossTierNameForMonto, TIER_BADGE_COLOR } from '../game/bossTier'

function formatMonto(monto) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(monto)
}

function formatHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// The blob-shaped card background — same path/viewBox as the uiverse.io weather-card
// reference the design is based on, just recolored per-jefe and stretched (via the
// card's own aspect-ratio + preserveAspectRatio="none") to fit any card size.
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

export default function BossCard({ jefe, rank, maxHpVisible, onSelect }) {
  const tierName = bossTierNameForMonto(jefe.monto_pagado)
  const colorB = shadeColorHex(jefe.color_hex, -42)
  const hpPct = Math.max(4, Math.round((jefe.hp_max / maxHpVisible) * 100))

  return (
    <div
      className={
        'boss-card group relative w-full overflow-hidden rounded-2xl shadow-lg shadow-black/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl' +
        (jefe.es_top1 ? ' ring-2 ring-utility-yellow-400' : '')
      }
      style={{ aspectRatio: '342 / 196' }}
    >
      <CardBlob id={`boss-blob-${jefe.id}`} colorA={jefe.color_hex} colorB={colorB} />
      {/* Scrim so white text stays legible no matter how light the sponsor's color is. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(120% 100% at 100% 0%, rgba(255,255,255,0.16), transparent 60%)' }}
      />

      <div className="absolute top-3 left-3 z-10">
        <RankBadge rank={rank} />
      </div>

      {jefe.es_top1 && (
        <Badge className="absolute top-3 left-14 z-10" color="warning" size="sm">
          <span className="animate-pulse">★</span>&nbsp;TOP 1
        </Badge>
      )}

      <div className="absolute -top-3 right-3 z-10 drop-shadow-lg">
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

      <div className="relative z-10 flex h-full flex-col justify-between p-4 pt-14 text-white">
        <div className="min-w-0">
          <p className="text-4xl leading-none font-black tracking-tight">
            {Math.round(jefe.hp_max).toLocaleString('es-MX')}
            <span className="ml-1 text-base font-semibold text-white/70">HP</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge color={TIER_BADGE_COLOR[tierName] ?? 'gray'} size="sm">
              {tierName}
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white/70">
              <Zap className="size-3" />
              {jefe.danio_por_golpe}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-white/70">
              <Flash className="size-3" />
              {jefe.frecuencia_ataque_segundos}s
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white/60">{formatMonto(jefe.monto_pagado)} pagados</p>
            <p className="truncate text-md font-bold">{jefe.nombre_marca}</p>
            {jefe.mensaje && <p className="truncate text-xs text-white/70 italic">“{jefe.mensaje}”</p>}
            {jefe.link_url && (
              <a
                href={jefe.link_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-white/80 underline decoration-white/40 underline-offset-2 hover:text-white hover:decoration-white"
              >
                <LinkExternal01 className="size-3 shrink-0" />
                <span className="truncate">{formatHost(jefe.link_url)}</span>
              </a>
            )}
          </div>
          <Button size="sm" color="primary" iconTrailing={ArrowRight} onClick={() => onSelect(jefe)} className="shrink-0">
            Retar
          </Button>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 h-1 bg-black/30">
        <div className="rank-bar-fill h-full" style={{ width: `${hpPct}%`, background: jefe.color_hex }} />
      </div>
    </div>
  )
}
