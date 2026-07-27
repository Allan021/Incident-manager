'use client'

import { useCallback, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { initials } from '@/lib/domain'

export function UserMenu({ user }: { user: { name: string; email: string } }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useClickOutside(ref, close, open)

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          background: 'none',
          border: '1px solid var(--border-strong)',
          borderRadius: '50%',
          padding: 2,
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--avatar-self)',
            color: 'var(--text-secondary)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 11.5,
            fontWeight: 600,
          }}
        >
          {initials(user.name)}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            right: 0,
            top: 40,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-strong)',
            borderRadius: 8,
            padding: 6,
            minWidth: 180,
            boxShadow: '0 12px 32px var(--scrim)',
          }}
        >
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-strong)', marginBottom: 4 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
          </div>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              role="menuitem"
              className="btn-ghost"
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                font: 'inherit',
                fontSize: 13,
                padding: '8px 10px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
