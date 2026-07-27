export function ConnectionLostBanner() {
  return (
    <div
      role="status"
      style={{
        background: 'var(--danger-surface)',
        borderBottom: '1px solid var(--danger-border)',
        color: 'var(--danger-text)',
        fontSize: 13,
        padding: '7px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--danger-dot)',
          display: 'inline-block',
        }}
      />
      Real-time connection lost — reconnecting…
    </div>
  )
}
