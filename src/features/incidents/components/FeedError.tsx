export function FeedError() {
  return (
    <div
      role="alert"
      style={{
        background: 'var(--surface)',
        border: '1px solid color-mix(in srgb, var(--critical) 35%, transparent)',
        borderRadius: 10,
        padding: 22,
        textAlign: 'center',
        fontSize: 13.5,
        color: 'var(--danger-text-soft)',
      }}
    >
      Couldn&apos;t load the activity feed. The rest of the page still works.
    </div>
  )
}
