'use client'

import { Icon } from '@/components/ui'
import { badge, type Meta } from '@/lib/domain'

export function FilterChip({
  meta,
  on,
  count,
  onToggle,
}: {
  meta: Meta
  on: boolean
  count: number
  onToggle: () => void
}) {
  const b = badge(meta.color)
  const dim = count === 0 && !on

  return (
    <button
      className="chip"
      onClick={onToggle}
      aria-pressed={on}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'inherit',
        fontSize: 12.5,
        fontWeight: 600,
        padding: '5px 11px',
        borderRadius: 99,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        background: on ? b.bg : 'transparent',
        border: `1px solid ${on ? b.border : 'var(--border)'}`,
        color: on ? b.fg : dim ? 'var(--text-faint)' : 'var(--text-muted)',
        boxShadow: on ? `0 0 0 1px ${b.border}` : undefined,
      }}
    >
      <Icon path={meta.icon} />
      {meta.label}
      <span
        style={{
          fontSize: 10.5,
          fontFamily: "'IBM Plex Mono',monospace",
          borderRadius: 99,
          padding: '0 6px',
          lineHeight: '16px',
          background: on ? 'color-mix(in srgb, var(--bg) 50%, transparent)' : 'var(--surface-raised)',
          color: on ? b.fg : 'var(--text-subtle)',
        }}
      >
        {count}
      </span>
    </button>
  )
}
