export default function IncidentLoading() {
  return (
    <main
      style={{
        flex: 1,
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        padding: '24px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <p className="sr-only" role="status">
        Loading incident…
      </p>
      <div className="skel" aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ height: 22, width: 80, background: 'var(--border)', borderRadius: 5 }} />
          <div style={{ height: 22, width: 96, background: 'var(--border)', borderRadius: 99 }} />
          <div style={{ height: 22, width: 112, background: 'var(--border)', borderRadius: 99 }} />
        </div>
        <div style={{ height: 28, width: '70%', background: 'var(--border)', borderRadius: 5 }} />
        <div style={{ height: 14, width: '40%', background: 'var(--border)', borderRadius: 4 }} />
        <div style={{ height: 60, width: '100%', background: 'var(--border)', borderRadius: 6 }} />
        <div style={{ height: 150, width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} />
      </div>
    </main>
  )
}
