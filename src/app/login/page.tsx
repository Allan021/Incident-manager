import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import { Logo } from '@/components/ui'
import { LoginForm } from '@/features/auth'

export const metadata = { title: 'Sign in — KizerWatch' }

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

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>
          New to incident response? <Link href="/status-guide">Read the status guide</Link>
        </p>
      </div>
    </main>
  )
}
