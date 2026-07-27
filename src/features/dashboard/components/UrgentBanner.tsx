import Link from 'next/link'
import { RelativeTime } from '@/components/RelativeTime'
import { ST } from '@/lib/domain'
import type { Incident } from '@/lib/types'

export function UrgentBanner({ criticals }: { criticals: Incident[] }) {
  const urgent = criticals[0]
  if (!urgent) return null

  return (
    <section
      aria-label="Critical incidents"
      style={{
        background: 'linear-gradient(90deg,color-mix(in srgb, var(--critical) 14%, transparent),color-mix(in srgb, var(--critical) 5%, transparent))',
        border: '1px solid color-mix(in srgb, var(--critical) 45%, transparent)',
        borderLeft: '4px solid var(--critical)',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 14,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span
        aria-hidden="true"
        className="skel"
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--critical)',
          flexShrink: 0,
          boxShadow: '0 0 10px color-mix(in srgb, var(--critical) 80%, transparent)',
        }}
      />
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--danger-text-soft)', marginBottom: 1 }}>
          {criticals.length === 1
            ? '1 critical incident needs action'
            : `${criticals.length} critical incidents need action`}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 560,
          }}
        >
          {urgent.title} ·{' '}
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", color: 'var(--text-muted)' }}>
            {urgent.id} · opened <RelativeTime iso={urgent.created_at} /> ·{' '}
            {ST[urgent.status].label}
          </span>
        </div>
      </div>
      <Link
        href={`/incidents/${urgent.id}`}
        className="btn-primary"
        style={{
          background: 'var(--danger-action)',
          color: 'var(--on-accent)',
          fontSize: 12.5,
          fontWeight: 700,
          padding: '7px 16px',
          borderRadius: 7,
          whiteSpace: 'nowrap',
          textDecoration: 'none',
        }}
      >
        Respond now →
      </Link>
    </section>
  )
}
