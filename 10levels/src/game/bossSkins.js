// 10 boss skins, ranked noob -> pro. Only cosmetic — stats/hp still come from balance.py.
// Each style carries a preview colorA/colorB (used by the sponsor's skin picker); the actual
// in-game render always uses the sponsor's own color_hex instead, see PlatformerGame.jsx.
// Kept separate from PlatformerGame.jsx (same pattern as bossTier.js/progression.js) so the
// sponsor form can import the list of skins without pulling in the whole canvas component.
export const BOSS_STYLES = [
  { id: 'noob', name: '1. Noob', colorA: '#9a9a9a', colorB: '#7a7f86', aura: 0, badge: null, crooked: true },
  { id: 'principiante', name: '2. Principiante', colorA: '#b9cfe3', colorB: '#5ec8ff', aura: 0.12, badge: null },
  { id: 'amateur', name: '3. Amateur', colorA: '#c7d8ea', colorB: '#5ec8ff', aura: 0.28, badge: null },
  { id: 'competente', name: '4. Competente', colorA: '#c9954f', colorB: '#ffe6ad', aura: 0.22, badge: null, wood: true },
  { id: 'avanzado', name: '5. Avanzado', colorA: '#12151a', colorB: '#39ff9e', aura: 0.55, badge: null, neon: true },
  { id: 'experto', name: '6. Experto', colorA: '#c7cfd6', colorB: '#eef2f6', aura: 0.3, badge: null, chrome: true },
  { id: 'elite', name: '7. Élite', colorA: '#3a1330', colorB: '#ff5d7a', aura: 0.42, badge: null },
  { id: 'maestro', name: '8. Maestro', colorA: '#caa023', colorB: '#fff0c2', aura: 0.45, badge: 'crown', gold: true },
  { id: 'leyenda', name: '9. Leyenda', colorA: '#ff5ec8', colorB: '#5ec8ff', aura: 0.6, badge: 'star', holo: true, particles: 8 },
  { id: 'pro', name: '10. PRO', colorA: '#0a0a0f', colorB: '#00eaff', aura: 0.8, badge: 'PRO', neon: true, chrome: true, particles: 14 },
]

export function bossStyleForSkinId(skinId) {
  return BOSS_STYLES.find((s) => s.id === skinId) || BOSS_STYLES[0]
}

// Same formula as PlatformerGame.jsx's shadeColorHex — duplicated (not imported) so
// previewing a skin outside the fight doesn't have to pull in the whole canvas component.
export function shadeColorHex(hex, percent) {
  const num = parseInt(hex.slice(1), 16)
  const clamp = (v) => Math.max(0, Math.min(255, v))
  const r = clamp((num >> 16) + Math.round(2.55 * percent))
  const g = clamp(((num >> 8) & 0xff) + Math.round(2.55 * percent))
  const b = clamp((num & 0xff) + Math.round(2.55 * percent))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
