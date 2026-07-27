import { getStats } from '@/lib/queries'

export async function Stats() {
  const stats = await getStats()

  const mttr =
    stats.mttrMinutes == null
      ? '—'
      : `${Math.floor(stats.mttrMinutes / 60)}h ${stats.mttrMinutes % 60}m`

  const cards = [
    { label: 'Open incidents', value: String(stats.open), color: 'var(--text)', trend: 'live', trendColor: 'var(--text-muted)' },
    {
      label: 'Active criticals',
      value: String(stats.criticals),
      color: stats.criticals > 0 ? 'var(--critical)' : 'var(--success)',
      trend: stats.criticals > 0 ? 'needs attention' : 'all clear',
      trendColor: stats.criticals > 0 ? 'var(--critical)' : 'var(--success)',
    },
    {
      label: 'Resolved (7 days)',
      value: String(stats.resolvedLastWeek),
      color: 'var(--success)',
      trend: 'last 7 days',
      trendColor: 'var(--text-muted)',
    },
    { label: 'MTTR (7 days)', value: mttr, color: 'var(--text)', trend: 'mean time to resolve', trendColor: 'var(--text-muted)' },
  ]

  return (
    <>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '11px 14px',
          }}
        >
          <dt
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '.06em',
              marginBottom: 5,
              whiteSpace: 'nowrap',
            }}
          >
            {c.label}
          </dt>
          <dd
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              flexWrap: 'wrap',
              margin: 0,
            }}
          >
            <span
              style={{
                fontSize: 21,
                fontWeight: 700,
                fontFamily: "'IBM Plex Mono',monospace",
                color: c.color,
              }}
            >
              {c.value}
            </span>
            <span style={{ fontSize: 12, color: c.trendColor }}>{c.trend}</span>
          </dd>
        </div>
      ))}
    </>
  )
}
