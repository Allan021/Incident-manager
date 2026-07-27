import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getProfileName = cache(async (userId: string, fallback: string): Promise<string> => {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('name').eq('id', userId).maybeSingle()
  return (data?.name as string | undefined) ?? fallback
})
