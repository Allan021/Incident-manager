export function ImpactStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '.05em',
          marginBottom: 3,
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: 0 }}>{children}</dd>
    </div>
  )
}
