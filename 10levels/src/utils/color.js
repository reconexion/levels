// Deterministic color per player tag, so the same 3 letters always get the
// same avatar color across the leaderboard and the puja widget.
export function colorForTag(tag) {
  const clean = (tag || '???').toUpperCase()
  let hash = 0
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue} 65% 52%)`
}
