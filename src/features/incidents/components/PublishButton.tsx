'use client'

import { useFormStatus } from 'react-dom'

export function PublishButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary"
      style={{
        background: 'var(--accent)',
        border: 'none',
        color: 'var(--on-accent)',
        font: 'inherit',
        fontSize: 13.5,
        fontWeight: 600,
        padding: '8px 20px',
        borderRadius: 7,
        cursor: pending ? 'progress' : 'pointer',
        opacity: pending ? 0.55 : 1,
      }}
    >
      {pending ? 'Publishing…' : 'Publish'}
    </button>
  )
}
