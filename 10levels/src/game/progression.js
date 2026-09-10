// Points/weapon progression lives only in React state for the current session
// (no accounts) — see spec notes. Tune these to rebalance the weapon shop.

export const POINTS_PER_VICTORY = 50

// Cost in points to reach that weapon level (index) from the previous one.
// Index 0 (starting weapon) has no cost.
export const WEAPON_UPGRADE_COSTS = [null, 100, 250]

export function nextUpgradeCost(currentLevel) {
  return WEAPON_UPGRADE_COSTS[currentLevel + 1] ?? null
}

// Display-only mirror of PlatformerGame's GUN_LEVELS, for the out-of-combat weapon shop —
// kept separate so the menu doesn't import from the game canvas component's module.
export const WEAPON_LEVELS = [
  { id: 'normal', name: '1. Normal', damage: 9, fireRate: 0.14 },
  { id: 'red', name: '2. Red', damage: 14, fireRate: 0.1 },
  { id: 'shark', name: '3. Shark', damage: 21, fireRate: 0.07 },
]

// Every weapon upgrade also toughens the player up — more life to survive stronger jefes.
export const PLAYER_HP_BASE = 100
export const PLAYER_HP_PER_WEAPON_LEVEL = 50

export function getPlayerMaxHp(weaponLevel) {
  return PLAYER_HP_BASE + weaponLevel * PLAYER_HP_PER_WEAPON_LEVEL
}
