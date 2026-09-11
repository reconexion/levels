import { PLAYER_COLORS, PLAYER_SKINS } from '../game/playerCosmetics'
import { WEAPON_LEVELS, isWeaponMaxed } from '../game/progression'
import { useLocalStorage } from '../utils/useLocalStorage'
import gunNormalSrc from '../assets/predeterminado.png'
import gunRedSrc from '../assets/red.png'
import gunSharkSrc from '../assets/shark.png'
import gunDangerSrc from '../assets/Danger.png'

const GUN_IMAGES = [gunNormalSrc, gunRedSrc, gunSharkSrc, gunDangerSrc]

// Reads the same localStorage keys PlatformerGame.jsx writes to — the two are never
// mounted at the same time (menu vs. fight screen), so a plain read on mount is
// always fresh, no prop-drilling through App.jsx needed just for a preview.
export default function PlayerPreview({ weaponLevel, weaponSkinIndex }) {
  const [colorIndex] = useLocalStorage('10levels:player:colorIndex', 0)
  const [skinIndex] = useLocalStorage('10levels:player:skinIndex', 0)

  const color = PLAYER_COLORS[colorIndex] ?? PLAYER_COLORS[0]
  const skin = PLAYER_SKINS[skinIndex] ?? PLAYER_SKINS[0]
  const gunIndex = isWeaponMaxed(weaponLevel) ? weaponSkinIndex : weaponLevel
  const gunSrc = GUN_IMAGES[gunIndex] ?? GUN_IMAGES[0]
  const gunName = WEAPON_LEVELS[gunIndex]?.name ?? WEAPON_LEVELS[0].name

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: `${color.hex}22`, border: `2px solid ${color.hex}` }}
        title={skin.name}
      >
        <div
          className={skin.id === 'calabaza' ? 'player-preview-pumpkin' : 'player-preview-ghost'}
          style={{ background: color.hex }}
        >
          <span className="player-preview-eye" />
          <span className="player-preview-eye" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs tracking-wide text-quaternary uppercase">Tu personaje</span>
        <span className="text-sm font-semibold text-primary">{skin.name}</span>
        <div className="flex items-center gap-1.5">
          <img src={gunSrc} alt={gunName} className="h-5 w-auto object-contain drop-shadow" />
          <span className="text-xs font-medium text-tertiary">{gunName}</span>
        </div>
      </div>
    </div>
  )
}
