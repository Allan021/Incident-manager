'use client'

import { useActionState } from 'react'
import { signIn, type SignInState } from '../actions'
import { PasswordField } from './PasswordField'
import { SubmitButton } from './SubmitButton'

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border-strong)',
  borderRadius: 7,
  color: 'var(--text)',
  font: 'inherit',
  fontSize: 14,
  padding: '9px 12px',
}

export function LoginForm() {
  const [state, formAction] = useActionState<SignInState, FormData>(signIn, { error: null })

  return (
    <form
      action={formAction}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label htmlFor="password" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Password
        </label>
        <PasswordField />
      </div>

      {state.error && (
        <div
          role="alert"
          style={{
            background: 'color-mix(in srgb, var(--critical) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--critical) 35%, transparent)',
            color: 'var(--danger-text-soft)',
            fontSize: 13,
            padding: '9px 12px',
            borderRadius: 7,
          }}
        >
          {state.error}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
