export function Logo({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size / 4.4,
        background: 'linear-gradient(135deg,var(--link),var(--monitoring))',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: size * 0.36,
          height: size * 0.36,
          background: 'var(--bg)',
          borderRadius: size / 11,
        }}
      />
    </div>
  )
}
