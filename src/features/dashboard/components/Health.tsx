import { Icon } from '@/components/ui'
import { palette } from '@/lib/tokens'
import { lastPoint, pts } from '@/lib/chart'
import { formatMetric, healthMetrics, metricState } from '@/lib/telemetry'

const STATE_STYLE = {
  critical: { color: palette.critical, label: 'Critical', icon: 'M8 2.5 14.5 13.5H1.5Z M8 7v2.6 M8 11.7v.01' },
  degraded: { color: palette.medium, label: 'Degraded', icon: 'M4 6.5h8 M4 9.5h8' },
  healthy: { color: palette.success, label: 'Healthy', icon: 'M2.5 8.5 6.5 12.5 13.5 4' },
} as const

export function Health({ hot }: { hot: boolean }) {
  const bucket = Math.floor(Date.now() / 30_000)
  const metrics = healthMetrics(bucket, hot)

  return (
    <section aria-label="Live system health" style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            color: 'var(--text-muted)',
          }}
        >
          Live system health
        </h2>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: 'var(--success)',
            fontFamily: "'IBM Plex Mono',monospace",
          }}
        >
          <span
            className="skel"
            aria-hidden="true"
            style={{ width: 7, height: 7, borderRadius: '50%', display: 'inline-block', background: 'var(--success)' }}
          />
          server-rendered · simulated
        </span>
      </div>

      <ul
        role="list"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: 10,
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {metrics.map((m) => {
          const state = metricState(m)
          const s = STATE_STYLE[state]
          const points = pts(m.series, 200, 44, m.min, m.max)
          const [dotX, dotY] = lastPoint(points)
          const threshY = (3 + (1 - (m.crit - m.min) / (m.max - m.min)) * 38).toFixed(1)
          const value = formatMetric(m)

          return (
            <li
              key={m.key}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${state === 'critical' ? 'color-mix(in srgb, var(--critical) 40%, transparent)' : 'var(--border)'}`,
                borderRadius: 10,
                padding: '10px 13px 8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {m.label}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: s.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon path={s.icon} size={10} />
                  {s.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 700,
                    fontFamily: "'IBM Plex Mono',monospace",
                    color: state === 'critical' ? 'var(--critical)' : 'var(--text)',
                  }}
                >
                  {value}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{m.unit}</span>
              </div>
              <svg
                viewBox="0 0 200 44"
                preserveAspectRatio="none"
                style={{ width: '100%', height: 34, display: 'block' }}
                role="img"
                aria-label={`${m.label}, currently ${value} ${m.unit}, ${s.label.toLowerCase()}`}
              >
                <line x1="0" y1={threshY} x2="200" y2={threshY} stroke={palette.dangerBorder} strokeWidth="1" strokeDasharray="4 3" />
                <polygon points={`${points} 200,44 0,44`} fill={s.color + '22'} />
                <polyline points={points} fill="none" stroke={s.color} strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx={dotX} cy={dotY} r="2.4" fill={s.color} />
              </svg>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
