import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { Logo } from '@/components/ui'
import { LoginForm } from '@/features/auth'

export const metadata = { title: 'Sign in — KizerWatch' }

function DemoAccess() {
  const email = process.env.NEXT_PUBLIC_DEMO_EMAIL
  const email2 = process.env.NEXT_PUBLIC_DEMO_EMAIL_2
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD
  if (!email || !password) return null

  const mono: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono',monospace",
    fontSize: 12.5,
    color: 'var(--text)',
    background: 'var(--bg)',
    border: '1px solid var(--border-strong)',
    borderRadius: 5,
    padding: '2px 7px',
    userSelect: 'all',
  }

  return (
    <aside
      aria-label="Reviewer demo access"
      style={{
        marginTop: 14,
        background: 'color-mix(in srgb, var(--link) 6%, transparent)',
        border: '1px solid color-mix(in srgb, var(--link) 30%, transparent)',
        borderRadius: 10,
        padding: '14px 16px',
        fontSize: 13,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}
    >
      <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--link)' }}>
        Reviewer access — no setup needed
      </p>
      <p style={{ margin: '0 0 6px' }}>
        Sign in with <span style={mono}>{email}</span> · password <span style={mono}>{password}</span>
      </p>
      {email2 && (
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          To watch real-time sync, open a private window signed in as{' '}
          <span style={mono}>{email2}</span> (same password), post an update on any incident, and
          see it appear in the other session without a refresh.
        </p>
      )}
    </aside>
  )
}

export default async function LoginPage() {
  if (await getUser()) redirect('/dashboard')

  return (
    <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Logo size={34} />
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: '.02em' }}>KizerWatch</span>
        </div>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: 13.5,
            margin: '0 0 28px',
          }}
        >
          Incident Command Center
        </p>

        <LoginForm />

        <DemoAccess />

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
          New to incident response? <Link href="/status-guide">Read the status guide</Link>
        </p>
      </div>
    </main>
  )
}
