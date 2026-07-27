'use client'

import { useEffect } from 'react'

export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[route error]', error)
  }, [error])

  return (
    <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
      <div
        role="alert"
        style={{
          background: 'var(--surface)',
          border: '1px solid color-mix(in srgb, var(--critical) 35%, transparent)',
          borderRadius: 10,
          padding: '36px 28px',
          textAlign: 'center',
          maxWidth: 420,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--danger-text-soft)' }}>
          Something went wrong
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 16 }}>
          We couldn&apos;t load this page. The problem has been logged.
        </div>
        <button
          onClick={reset}
          className="btn-primary"
          style={{
            background: 'var(--accent)',
            border: 'none',
            color: 'var(--on-accent)',
            font: 'inherit',
            fontSize: 13.5,
            fontWeight: 600,
            padding: '8px 18px',
            borderRadius: 7,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    </main>
  )
}
