import { avatarBg, initials } from '@/lib/domain'

export function Avatar({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: avatarBg(name),
        color: 'var(--text)',
        display: 'grid',
        placeItems: 'center',
        fontSize: size * 0.43,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  )
}
