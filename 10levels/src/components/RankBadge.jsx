// Rank 1/2/3 get a medal treatment; everyone else gets a plain numbered circle.
const MEDAL_STYLE = [
  { ring: 'ring-utility-yellow-300', bg: 'bg-utility-yellow-50', text: 'text-utility-yellow-700', emoji: '🥇' },
  { ring: 'ring-utility-slate-300', bg: 'bg-utility-slate-50', text: 'text-utility-slate-700', emoji: '🥈' },
  { ring: 'ring-utility-orange-300', bg: 'bg-utility-orange-50', text: 'text-utility-orange-700', emoji: '🥉' },
]

export default function RankBadge({ rank }) {
  const medal = MEDAL_STYLE[rank - 1]
  if (!medal) {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 text-sm font-bold text-white shadow ring-1 ring-white/10">
        {rank}
      </span>
    )
  }
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow ring-2 ${medal.bg} ${medal.text} ${medal.ring} ${rank === 1 ? 'rank-crown' : ''}`}
      title={`Puesto ${rank}`}
    >
      {medal.emoji}
    </span>
  )
}
