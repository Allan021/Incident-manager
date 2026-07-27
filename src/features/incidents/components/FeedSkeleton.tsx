export function FeedSkeleton() {
  return (
    <>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>Activity</h2>
      <div role="status" style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 8 }}>
        Loading activity…
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="skel"
          style={{ display: 'flex', gap: 12, padding: '12px 4px' }}
        >
          <div
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{ height: 11, width: '30%', background: 'var(--border)', borderRadius: 4, marginBottom: 9 }}
            />
            <div style={{ height: 12, width: '80%', background: 'var(--border)', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </>
  )
}
