'use client'

import { useState } from 'react'

const EYE = 'M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8Z M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'
const EYE_OFF =
  'M3 3l10 10 M6.5 4.2A6.9 6.9 0 0 1 8 4c4 0 6.5 4 6.5 4a12.3 12.3 0 0 1-2.1 2.4 M4.6 5.6A11.8 11.8 0 0 0 1.5 8s2.5 4 6.5 4a6.7 6.7 0 0 0 2.9-.6'

export function PasswordField() {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'flex' }}>
      <input
        id="password"
        name="password"
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        required
        placeholder="••••••••"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border-strong)',
          borderRadius: 7,
          color: 'var(--text)',
          font: 'inherit',
          fontSize: 14,
          padding: '9px 44px 9px 12px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        style={{
          position: 'absolute',
          right: 2,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 40,
          height: 36,
          display: 'grid',
          placeItems: 'center',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          borderRadius: 6,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d={visible ? EYE_OFF : EYE}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
