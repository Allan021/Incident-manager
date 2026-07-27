export function StatsSkeleton() {
  return (
    <>
      <div className="sr-only" role="status">
        Loading incident statistics…
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="skel"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div
            style={{
              height: 11,
              width: '60%',
              background: 'var(--border)',
              borderRadius: 4,
              marginBottom: 14,
            }}
          />
          <div style={{ height: 26, width: '38%', background: 'var(--border)', borderRadius: 5 }} />
        </div>
      ))}
    </>
  )
}
