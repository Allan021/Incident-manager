export default function DashboardLoading() {
  return (
    <main
      style={{
        flex: 1,
        width: '100%',
        maxWidth: 1160,
        margin: '0 auto',
        padding: '20px 24px 60px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px' }}>Incidents</h1>
      <p className="sr-only" role="status">
        Loading incidents…
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="skel"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ height: 20, width: 76, background: 'var(--border)', borderRadius: 99 }} />
            <div style={{ height: 20, width: 96, background: 'var(--border)', borderRadius: 99 }} />
            <div style={{ flex: 1, height: 14, background: 'var(--border)', borderRadius: 4, maxWidth: 420 }} />
            <div style={{ height: 14, width: 110, background: 'var(--border)', borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </main>
  )
}
