export function StatsError() {
  return (
    <div
      role="alert"
      style={{
        gridColumn: '1 / -1',
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb, var(--critical) 35%, transparent)',
        borderRadius: 10,
        padding: '14px 16px',
        fontSize: 13,
        color: 'var(--danger-text-soft)',
      }}
    >
      Statistics are unavailable right now. The incident list below is unaffected.
    </div>
  )
}
