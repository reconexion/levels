import { Award01, Star01 } from '@untitledui/icons'
import { bossStyleForSkinId, shadeColorHex } from '../game/bossSkins'

// A small, self-contained visual preview of a boss's actual in-game skin (colors +
// effects: aura glow, neon flicker, chrome shine, gold sparkle, holographic sheen,
// wood grain, a crooked "noob" tilt, floating particles, a prestige badge) — built
// from the same BOSS_STYLES data and color formula PlatformerGame.jsx uses, so what
// you see here in the boss list is what you'll actually fight. Deliberately not a
// pixel-perfect copy of the canvas sprite (that logic lives deep in the game's
// render loop) — just enough of its personality to recognize the skin at a glance.
export default function BossSkinPreview({ jefe, size = 56 }) {
  const style = bossStyleForSkinId(jefe.skin_id)
  const colorA = jefe.color_hex
  const colorB = shadeColorHex(colorA, 45)
  const particleCount = Math.min(style.particles ?? 0, 6)

  return (
    <div
      className="skin-preview relative shrink-0 overflow-visible"
      style={{ width: size, height: size }}
      title={`Skin: ${style.name}`}
      role="img"
      aria-label={`Skin del jefe: ${style.name}`}
    >
      {style.aura > 0 && (
        <div
          aria-hidden
          className={`skin-preview-aura absolute inset-0 rounded-2xl ${style.neon ? 'skin-preview-aura-neon' : ''}`}
          style={{
            boxShadow: `0 0 ${8 + style.aura * 26}px ${style.aura * 10}px ${colorB}`,
            opacity: 0.35 + style.aura * 0.5,
          }}
        />
      )}

      <div
        aria-hidden
        className={`relative flex size-full items-center justify-center overflow-hidden rounded-2xl ${style.crooked ? 'skin-preview-crooked' : ''}`}
        style={{ background: `linear-gradient(145deg, ${colorA}, ${colorB})` }}
      >
        {style.wood && (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 6px)',
            }}
          />
        )}
        {style.chrome && <div className="skin-preview-chrome absolute inset-0" />}
        {style.holo && <div className="skin-preview-holo absolute inset-0" />}
        {style.gold && <div className="skin-preview-gold-ring absolute inset-0 rounded-2xl" />}

        {/* Face: round eye + X eye, echoing the real in-fight boss sprite. */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="skin-preview-eye-round" style={{ background: colorB }} />
          <span className="skin-preview-eye-x" style={{ color: colorB }}>
            ×
          </span>
        </div>

        {particleCount > 0 &&
          Array.from({ length: particleCount }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="skin-preview-particle"
              style={{
                background: colorB,
                left: `${12 + ((i * 37) % 76)}%`,
                top: `${10 + ((i * 53) % 70)}%`,
                animationDelay: `${(i % 4) * 0.4}s`,
              }}
            />
          ))}
      </div>

      {style.badge === 'crown' && (
        <Award01 className="absolute -top-1.5 -right-1.5 z-20 size-4 rounded-full bg-utility-yellow-50 p-0.5 text-utility-yellow-600 ring-1 ring-utility-yellow-300" />
      )}
      {style.badge === 'star' && (
        <Star01 className="absolute -top-1.5 -right-1.5 z-20 size-4 rounded-full bg-utility-pink-50 p-0.5 text-utility-pink-600 ring-1 ring-utility-pink-300" />
      )}
      {style.badge === 'PRO' && (
        <span className="absolute -top-1.5 -right-1.5 z-20 rounded-full bg-black px-1 text-[8px] font-bold text-white ring-1 ring-white/40">
          PRO
        </span>
      )}
    </div>
  )
}
