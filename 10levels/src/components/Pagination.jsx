import { ChevronLeft, ChevronRight } from '@untitledui/icons'

// Classic truncated pagination: 1 … 4 5 6 … 57 — always shows first/last page,
// the current page, and one sibling on each side; collapses the rest into "…".
function getPageNumbers(current, total, siblings = 1) {
  const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i)
  const totalNumbersShown = siblings * 2 + 5

  if (totalNumbersShown >= total) return range(1, total)

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < total - 1

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblings * 2), '…', total]
  }
  if (showLeftDots && !showRightDots) {
    return [1, '…', ...range(total - (2 + siblings * 2), total)]
  }
  return [1, '…', ...range(leftSibling, rightSibling), '…', total]
}

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginación">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        className="flex size-8 items-center justify-center rounded-md text-tertiary transition-colors duration-150 hover:bg-primary_hover hover:text-tertiary_hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`dots-${i}`} className="flex size-8 items-center justify-center text-sm text-quaternary">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={
              'flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150' +
              (p === page ? ' bg-brand-solid text-white shadow-xs' : ' text-secondary hover:bg-primary_hover')
            }
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className="flex size-8 items-center justify-center rounded-md text-tertiary transition-colors duration-150 hover:bg-primary_hover hover:text-tertiary_hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
