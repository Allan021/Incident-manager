'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className="nav-btn"
      aria-current={active ? 'page' : undefined}
      style={{
        background: active ? 'var(--surface-raised)' : 'none',
        color: active ? 'var(--text)' : 'var(--text-muted)',
        fontSize: 13.5,
        fontWeight: 500,
        padding: '6px 12px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  )
}
