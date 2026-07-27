'use client'

export function TabButton({
  label,
  count,
  color,
  selected,
  onSelect,
}: {
  label: string
  count: number
  color: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: selected ? 'var(--surface-raised)' : 'none',
        border: 'none',
        color: selected ? 'var(--text)' : 'var(--text-muted)',
        font: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        padding: '6px 14px',
        borderRadius: 6,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      <span
        style={{
          fontSize: 11,
          fontFamily: "'IBM Plex Mono',monospace",
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color,
          borderRadius: 99,
          padding: '1px 7px',
        }}
      >
        {count}
      </span>
    </button>
  )
}
