import Link from 'next/link'
import { Avatar, Badge } from '@/components/ui'
import { RelativeTime } from '@/components/RelativeTime'
import { pts } from '@/lib/chart'
import { palette } from '@/lib/tokens'
import { SEV, ST } from '@/lib/domain'
import { impactSeries } from '@/lib/telemetry'
import type { Incident } from '@/lib/types'

export function IncidentRow({ incident }: { incident: Incident }) {
  const sev = SEV[incident.severity]
  const st = ST[incident.status]
  const owner = incident.owner?.name ?? 'Unassigned'
  const resolved = incident.status === 'resolved'
  const spark = pts(impactSeries(incident.id, incident.severity, incident.status), 80, 24, 0, 100, 2)

  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="row"
      aria-label={`${sev.label} ${st.label} incident: ${incident.title}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${resolved ? 'var(--success-border)' : sev.color}`,
        borderRadius: 10,
        padding: '9px 14px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        color: 'inherit',
        textDecoration: 'none',
        transition: 'background .15s ease,border-color .15s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          minWidth: 0,
          flex: 1,
        }}
      >
        <Badge meta={sev} />
        <Badge meta={st} />
        <div style={{ minWidth: 220, flex: 1 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {incident.title}
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 520,
            }}
          >
            {incident.description}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <svg
          viewBox="0 0 80 24"
          preserveAspectRatio="none"
          style={{ width: 80, height: 24 }}
          aria-hidden="true"
        >
          <polyline
            points={spark}
            fill="none"
            stroke={resolved ? palette.borderHover : sev.color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Avatar name={owner} />
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{owner}</span>
        </div>
        <RelativeTime iso={incident.updated_at} style={{ fontSize: 12, color: 'var(--text-muted)' }} />
        <span
          title="Updates"
          style={{
            fontSize: 11.5,
            color: 'var(--text-muted)',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 5,
            padding: '2px 7px',
            fontFamily: "'IBM Plex Mono',monospace",
            whiteSpace: 'nowrap',
          }}
        >
          {incident.update_count} upd
        </span>
      </div>
    </Link>
  )
}
