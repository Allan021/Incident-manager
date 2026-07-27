import { badge, type Meta } from '@/lib/domain'
import { Icon } from './Icon'

export function Badge({
  meta,
  size = 'sm',
  minWidth,
  style,
}: {
  meta: Meta
  size?: 'sm' | 'md'
  minWidth?: number
  style?: React.CSSProperties
}) {
  const b = badge(meta.color)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 5 : 6,
        background: b.bg,
        border: `1px solid ${b.border}`,
        color: b.fg,
        fontSize: size === 'sm' ? 11.5 : 12,
        fontWeight: 600,
        padding: size === 'sm' ? '3px 9px' : '4px 11px',
        borderRadius: 99,
        whiteSpace: 'nowrap',
        minWidth,
        justifyContent: minWidth ? 'center' : undefined,
        ...style,
      }}
    >
      <Icon path={meta.icon} size={size === 'sm' ? 11 : 12} />
      {meta.label}
    </span>
  )
}
