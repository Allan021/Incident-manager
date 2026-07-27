import { redirect } from 'next/navigation'
import { Nav } from '@/components/nav'
import { getProfileName } from '@/lib/queries'
import { getUser } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const name = await getProfileName(user.id, user.email!.split('@')[0])

  return (
    <>
      <Nav user={{ name, email: user.email! }} />
      {children}
    </>
  )
}
