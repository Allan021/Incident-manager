'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
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
        fontSize: 14,
        fontWeight: 600,
        padding: 10,
        borderRadius: 7,
        cursor: pending ? 'progress' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending && (
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            border: '2px solid color-mix(in srgb, var(--on-accent) 35%, transparent)',
            borderTopColor: 'var(--on-accent)',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin .7s linear infinite',
          }}
        />
      )}
      <span>{pending ? 'Signing in…' : 'Sign in'}</span>
    </button>
  )
}
