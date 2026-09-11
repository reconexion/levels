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

export const MAX_WEAPON_LEVEL = WEAPON_LEVELS.length - 1

export function isWeaponMaxed(weaponLevel) {
  return weaponLevel >= MAX_WEAPON_LEVEL
}

// Once the Shark is maxed, points stop buying a new gun and start buying raw power
// instead — flat cost per purchase, stacking with no cap other than your point balance.
export const POST_MAX_UPGRADE_COST = 150
export const BONUS_HP_PER_LEVEL = 15
export const BONUS_DAMAGE_PER_LEVEL = 3

// The cost of the *next* upgrade regardless of whether it's a new weapon or a
// post-max power boost — the one thing the "Mejorar" button needs to know.
export function upgradeCostFor(weaponLevel) {
  return isWeaponMaxed(weaponLevel) ? POST_MAX_UPGRADE_COST : nextUpgradeCost(weaponLevel)
}

// Every weapon upgrade also toughens the player up — more life to survive stronger jefes.
export const PLAYER_HP_BASE = 100
export const PLAYER_HP_PER_WEAPON_LEVEL = 50

export function getPlayerMaxHp(weaponLevel, bonusLevel = 0) {
  return PLAYER_HP_BASE + weaponLevel * PLAYER_HP_PER_WEAPON_LEVEL + bonusLevel * BONUS_HP_PER_LEVEL
}

export function getBonusDamage(bonusLevel = 0) {
  return bonusLevel * BONUS_DAMAGE_PER_LEVEL
}
