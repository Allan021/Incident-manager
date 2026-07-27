import type { Metadata } from 'next'
import { ToastProvider } from '@/components/toast'
import { cssVariables } from '@/lib/tokens'
import './globals.css'

export const metadata: Metadata = {
  title: 'Opswatch — Incident Command Center',
  description: 'Monitor and coordinate active operational incidents.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`:root{${cssVariables}}`}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <div
            style={{
              minHeight: '100vh',
              background: 'var(--bg)',
              color: 'var(--text)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
