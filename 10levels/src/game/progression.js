// Points/weapon progression lives only in React state for the current session
// (no accounts) — see spec notes. Tune these to rebalance the weapon shop.

export const POINTS_PER_VICTORY = 50

// Reward scales with the boss's rank across the *entire* sponsored-boss leaderboard
// (1 = the current #1 boss — most HP/damage, hardest fight, biggest reward), not with
// wherever it happens to land in a filtered/paginated view.
export const REWARD_POINTS_FOR_RANK_1 = 200
export const REWARD_POINTS_STEP_PER_RANK = 15
export const REWARD_POINTS_MIN = 20

export function pointsForRank(rank) {
  if (!rank || rank < 1) return POINTS_PER_VICTORY
  return Math.max(REWARD_POINTS_MIN, REWARD_POINTS_FOR_RANK_1 - (rank - 1) * REWARD_POINTS_STEP_PER_RANK)
}

// Cost in points to reach that weapon level (index) from the previous one.
// Index 0 (starting weapon) has no cost. Each tier costs noticeably more than the
// last, so the grind ramps up rather than staying flat.
export const WEAPON_UPGRADE_COSTS = [null, 100, 280, 600]

export function nextUpgradeCost(currentLevel) {
  return WEAPON_UPGRADE_COSTS[currentLevel + 1] ?? null
}

// Display-only mirror of PlatformerGame's GUN_LEVELS, for the out-of-combat weapon shop —
// kept separate so the menu doesn't import from the game canvas component's module.
export const WEAPON_LEVELS = [
  { id: 'normal', name: '1. Normal', damage: 9, fireRate: 0.14 },
  { id: 'red', name: '2. Red', damage: 14, fireRate: 0.1 },
  { id: 'shark', name: '3. Shark', damage: 21, fireRate: 0.07 },
  { id: 'danger', name: '4. Danger', damage: 30, fireRate: 0.055 },
]

export const MAX_WEAPON_LEVEL = WEAPON_LEVELS.length - 1

export function isWeaponMaxed(weaponLevel) {
  return weaponLevel >= MAX_WEAPON_LEVEL
}

// Once Danger is maxed, points stop buying a new gun and start buying raw power
// instead. Cost climbs with every purchase — no hard cap, but each boost is harder
// to afford than the last, same spirit as the weapon tiers above.
export const POST_MAX_BASE_COST = 200
export const POST_MAX_COST_STEP = 60
export const BONUS_HP_PER_LEVEL = 15
export const BONUS_DAMAGE_PER_LEVEL = 3

export function postMaxUpgradeCost(bonusLevel) {
  return POST_MAX_BASE_COST + bonusLevel * POST_MAX_COST_STEP
}

// The cost of the *next* upgrade regardless of whether it's a new weapon or a
// post-max power boost — the one thing the "Mejorar" button needs to know.
export function upgradeCostFor(weaponLevel, bonusLevel = 0) {
  return isWeaponMaxed(weaponLevel) ? postMaxUpgradeCost(bonusLevel) : nextUpgradeCost(weaponLevel)
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
