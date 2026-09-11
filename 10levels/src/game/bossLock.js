import { useEffect, useState } from 'react'

// How long a boss stays locked after being defeated, so a player can't just
// re-farm the same fight back-to-back for points.
export const BOSS_LOCK_MS = 90 * 1000

export function lockRemainingMs(defeatedAt, now = Date.now()) {
  if (!defeatedAt) return 0
  return Math.max(0, defeatedAt + BOSS_LOCK_MS - now)
}

export function isBossLocked(defeatedAt, now = Date.now()) {
  return lockRemainingMs(defeatedAt, now) > 0
}

export function formatLockRemaining(ms) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

// Ticks once a second while `defeatedAt` keeps the boss locked, so callers get a
// live mm:ss countdown without each one wiring its own interval. Stops ticking
// (and clears the interval) the moment the lock actually expires.
export function useLockRemaining(defeatedAt) {
  // Re-derive `remaining` during render when `defeatedAt` itself changes (a new
  // defeat, or a different boss) — the React-recommended way to reset state from
  // a changed prop without an extra effect-triggered render.
  const [prevDefeatedAt, setPrevDefeatedAt] = useState(defeatedAt)
  const [remaining, setRemaining] = useState(() => lockRemainingMs(defeatedAt))
  if (defeatedAt !== prevDefeatedAt) {
    setPrevDefeatedAt(defeatedAt)
    setRemaining(lockRemainingMs(defeatedAt))
  }

  useEffect(() => {
    if (!defeatedAt) return
    const id = setInterval(() => {
      const next = lockRemainingMs(defeatedAt)
      setRemaining(next)
      if (next <= 0) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [defeatedAt])

  return remaining
}
