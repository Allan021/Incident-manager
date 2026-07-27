import Link from 'next/link'
import { Logo } from '@/components/ui'
import { NavLink } from './NavLink'
import { UserMenu } from './UserMenu'

export function Nav({ user }: { user: { name: string; email: string } | null }) {
  return (
    <header
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        height: 52,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Link
        href={user ? '/dashboard' : '/status-guide'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <Logo />
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '.02em' }}>KizerWatch</span>
      </Link>

      <nav style={{ display: 'flex', gap: 4, flex: 1 }} aria-label="Main">
        {user && <NavLink href="/dashboard" label="Dashboard" />}
        <NavLink href="/status-guide" label="Status guide" />
      </nav>

      {user ? (
        <UserMenu user={user} />
      ) : (
        <Link
          href="/login"
          className="btn-ghost"
          style={{
            border: '1px solid var(--border-strong)',
            color: 'var(--text-secondary)',
            fontSize: 13,
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          Sign in
        </Link>
      )}
    </header>
  )
}
