'use client'

import { Icon } from '@/components/ui'
import { useUrlFilters } from '@/hooks/useUrlFilters'
import { SEV, SEVERITIES, ST, STATUSES } from '@/lib/domain'
import { FilterChip } from './FilterChip'
import { TabButton } from './TabButton'

export function Filters({
  counts,
  shown,
  total,
}: {
  counts: {
    bySeverity: Record<string, number>
    byStatus: Record<string, number>
    active: number
    resolved: number
  }
  shown: number
  total: number
}) {
  const { tab, sev, status, pending, setTab, toggle, clear } = useUrlFilters()
  const filterCount = sev.length + status.length

  return (
    <section
      aria-label="Filters"
      aria-busy={pending}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        opacity: pending ? 0.7 : 1,
        transition: 'opacity .15s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          role="tablist"
          aria-label="Incident state"
          style={{
            display: 'flex',
            background: 'var(--bg)',
            border: '1px solid var(--border-strong)',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          <TabButton
            label="Active"
            count={counts.active}
            color="var(--critical)"
            selected={tab === 'active'}
            onSelect={() => setTab('active')}
          />
          <TabButton
            label="Resolved"
            count={counts.resolved}
            color="var(--success)"
            selected={tab === 'resolved'}
            onSelect={() => setTab('resolved')}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            role="status"
            style={{
              fontSize: 12.5,
              color: 'var(--text-muted)',
              fontFamily: "'IBM Plex Mono',monospace",
              whiteSpace: 'nowrap',
            }}
          >
            {shown} of {total} shown
          </span>
          {filterCount > 0 && (
            <button
              onClick={clear}
              className="chip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-strong)',
                color: 'var(--link-hover)',
                font: 'inherit',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '5px 12px',
                borderRadius: 99,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon path="M3 3l10 10 M13 3 3 13" size={10} />
              Clear ({filterCount})
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px', padding: '12px 16px' }}>
        <div
          role="group"
          aria-label="Filter by severity"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 11,
              color: 'var(--text-subtle)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              marginRight: 4,
            }}
          >
            Severity
          </span>
          {SEVERITIES.map((k) => (
            <FilterChip
              key={k}
              meta={SEV[k]}
              on={sev.includes(k)}
              count={counts.bySeverity[k] ?? 0}
              onToggle={() => toggle('sev', k)}
            />
          ))}
        </div>
        <div
          role="group"
          aria-label="Filter by status"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}
        >
          <span
            aria-hidden="true"
            style={{
              fontSize: 11,
              color: 'var(--text-subtle)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              marginRight: 4,
            }}
          >
            Status
          </span>
          {STATUSES.map((k) => (
            <FilterChip
              key={k}
              meta={ST[k]}
              on={status.includes(k)}
              count={counts.byStatus[k] ?? 0}
              onToggle={() => toggle('status', k)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
