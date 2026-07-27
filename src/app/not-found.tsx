import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono',monospace",
            fontSize: 44,
            fontWeight: 500,
            color: 'var(--border-hover)',
            marginBottom: 10,
          }}
        >
          404
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
          This page doesn&apos;t exist
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20 }}>
          It may have been removed, or the link is wrong.
        </div>
        <Link
          href="/dashboard"
          className="btn-primary"
          style={{
            display: 'inline-block',
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontSize: 13.5,
            fontWeight: 600,
            padding: '9px 20px',
            borderRadius: 7,
            textDecoration: 'none',
          }}
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  )
}
