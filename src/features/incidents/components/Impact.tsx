import { Icon } from '@/components/ui'
import { lastPoint, pts } from '@/lib/chart'
import { badge, SEV, SEV_ORDER, type Severity } from '@/lib/domain'
import { impactSeries } from '@/lib/telemetry'
import { palette } from '@/lib/tokens'
import type { Incident } from '@/lib/types'
import { ImpactStat } from './ImpactStat'

const TREND = {
  rising: { label: 'Rising', color: 'var(--critical)', icon: 'M3.5 10.5 8 6l4.5 4.5' },
  falling: { label: 'Falling', color: 'var(--success)', icon: 'M3.5 6 8 10.5 12.5 6' },
  steady: { label: 'Steady', color: 'var(--text-muted)', icon: 'M4 8h8' },
} as const

export function Impact({ incident }: { incident: Incident }) {
  const arr = impactSeries(incident.id, incident.severity, incident.status)
  const score = Math.round(arr[arr.length - 1])

  const suggested: Severity = score >= 65 ? 'critical' : score >= 40 ? 'high' : score >= 15 ? 'medium' : 'low'
  const meta = SEV[suggested]
  const b = badge(meta.color)

  const avg = (xs: number[]) => xs.reduce((a, x) => a + x, 0) / xs.length
  const delta = avg(arr.slice(-5)) - avg(arr.slice(-10, -5))
  const trend = TREND[delta > 1.5 ? 'rising' : delta < -1.5 ? 'falling' : 'steady']

  const points = pts(arr, 660, 110, 0, 100, 4)
  const [dotX, dotY] = lastPoint(points)

  const raise = SEV_ORDER[suggested] < SEV_ORDER[incident.severity]
  const lower =
    SEV_ORDER[suggested] > SEV_ORDER[incident.severity] &&
    trend.label === 'Falling' &&
    incident.status !== 'resolved'

  const users = incident.status === 'resolved' ? 0 : Math.round(score * 240)
  const regions =
    incident.severity === 'critical'
      ? 'us-east-1 · eu-west-1'
      : incident.severity === 'high'
        ? 'us-east-1'
        : 'internal'

  return (
    <section
      aria-label="Impact"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '16px 18px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '.06em',
            color: 'var(--text-muted)',
          }}
        >
          Impact — last 30 min
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: b.bg,
            border: `1px solid ${b.border}`,
            color: b.fg,
            fontSize: 11.5,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 99,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon path={meta.icon} size={11} />
          Signal: {meta.label}
        </span>
      </div>

      <svg
        viewBox="0 0 660 110"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 110, display: 'block', marginBottom: 12 }}
        role="img"
        aria-label={`Impact score over the last 30 minutes, currently ${score} out of 100, ${trend.label.toLowerCase()}`}
      >
        {[28, 55, 82].map((y) => (
          <line key={y} x1="0" y1={y} x2="660" y2={y} stroke={palette.border} strokeWidth="1" />
        ))}
        <line x1="0" y1="39.7" x2="660" y2="39.7" stroke={palette.dangerBorder} strokeWidth="1" strokeDasharray="5 4" />
        <polygon points={`${points} 660,110 0,110`} fill={meta.color + '1f'} />
        <polyline points={points} fill="none" stroke={meta.color} strokeWidth="2" strokeLinejoin="round" />
        <circle cx={dotX} cy={dotY} r="3" fill={meta.color} />
      </svg>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
          gap: 12,
          margin: 0,
        }}
      >
        <ImpactStat label="Impact score">
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "'IBM Plex Mono',monospace",
              color: meta.color,
            }}
          >
            {score}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}> /100</span>
          </div>
        </ImpactStat>
        <ImpactStat label="Users affected">
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace" }}>
            {users.toLocaleString('en-US')}
          </div>
        </ImpactStat>
        <ImpactStat label="Regions">
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace" }}>
            {regions}
          </div>
        </ImpactStat>
        <ImpactStat label="Trend">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 13,
              fontWeight: 600,
              color: trend.color,
              marginTop: 3,
            }}
          >
            <Icon path={trend.icon} />
            {trend.label}
          </div>
        </ImpactStat>
      </dl>

      {(raise || lower) && (
        <div
          style={{
            marginTop: 12,
            background: 'color-mix(in srgb, var(--medium) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--medium) 30%, transparent)',
            color: 'var(--medium)',
            fontSize: 12.5,
            padding: '8px 12px',
            borderRadius: 7,
          }}
        >
          {raise
            ? `Impact signal (${score}/100) is above the ${meta.label} threshold — consider raising severity to ${meta.label}.`
            : `Impact is falling and now reads ${meta.label} — severity could likely be lowered.`}
        </div>
      )}
    </section>
  )
}
