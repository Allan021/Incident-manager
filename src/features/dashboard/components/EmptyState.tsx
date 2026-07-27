import Link from 'next/link'

export function EmptyState({ hasFilters, tab }: { hasFilters: boolean; tab: string }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '48px 20px',
        textAlign: 'center',
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 16 16"
        aria-hidden="true"
        style={{ color: 'var(--border-hover)', marginBottom: 12 }}
      >
        <path
          d="M11.6 11.6 14.5 14.5 M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>
        {hasFilters ? 'No incidents match your filters' : `No ${tab} incidents`}
      </p>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 16px' }}>
        {hasFilters
          ? 'Try broadening your filters or switching tabs.'
          : 'Nothing to see here — good.'}
      </p>
      {hasFilters && (
        <Link
          href="/dashboard"
          className="btn-ghost"
          style={{
            display: 'inline-block',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-strong)',
            color: 'var(--text-secondary)',
            fontSize: 13.5,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 7,
            textDecoration: 'none',
          }}
        >
          Clear filters
        </Link>
      )}
    </div>
  )
}
