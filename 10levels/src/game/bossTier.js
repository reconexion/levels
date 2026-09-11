// Sponsors only pick a color — how "prestigious" a jefe looks (both in-game, via
// PlatformerGame's BOSS_STYLES, and in the menu's sponsor tier badge) scales with monto_pagado
// instead, so a bigger check also reads as a bigger deal. Shared here so both stay in sync.

export const BOSS_TIER_NAMES = [
  'Noob',
  'Principiante',
  'Amateur',
  'Competente',
  'Avanzado',
  'Experto',
  'Élite',
  'Maestro',
  'Leyenda',
  'PRO',
]

const TIER_MONTO_CEILING = 50000

export function bossTierIndexForMonto(monto) {
  const t = Math.max(0, Math.min(1, Math.log10(1 + monto) / Math.log10(1 + TIER_MONTO_CEILING)))
  return Math.min(BOSS_TIER_NAMES.length - 1, Math.floor(t * BOSS_TIER_NAMES.length))
}

export function bossTierNameForMonto(monto) {
  return BOSS_TIER_NAMES[bossTierIndexForMonto(monto)]
}

// Badge color per tier name, shared between the boss cards and anywhere else a tier
// needs a consistent color (kept here so it can't drift out of sync with the names above).
export const TIER_BADGE_COLOR = {
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
