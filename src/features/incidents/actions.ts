'use server'

import { revalidatePath } from 'next/cache'
import { isSeverity, isStatus } from '@/lib/domain'
import { createClient, getUser } from '@/lib/supabase/server'

export type ActionResult = { ok: boolean; error?: string }

const MAX_MESSAGE = 2000

export async function postUpdate(incidentId: string, formData: FormData): Promise<ActionResult> {
  const user = await getUser()
  if (!user) return { ok: false, error: 'Your session expired. Sign in again.' }

  const message = String(formData.get('message') ?? '').trim()
  if (!message) return { ok: false, error: 'Write something before publishing.' }
  if (message.length > MAX_MESSAGE) return { ok: false, error: `Updates are limited to ${MAX_MESSAGE} characters.` }

  const supabase = await createClient()
  const { error } = await supabase
    .from('incident_updates')
    .insert({ incident_id: incidentId, author_id: user.id, message })

  if (error) {
    console.error('[postUpdate]', error)
    return { ok: false, error: "We couldn't save your update. Try again." }
  }

  revalidatePath(`/incidents/${incidentId}`)
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function updateIncidentField(
  incidentId: string,
  field: 'status' | 'severity',
  value: string,
): Promise<ActionResult> {
  const user = await getUser()
  if (!user) return { ok: false, error: 'Your session expired. Sign in again.' }

  const valid = field === 'status' ? isStatus(value) : isSeverity(value)
  if (!valid) return { ok: false, error: 'Unrecognised value.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('incidents')
    .update({ [field]: value })
    .eq('id', incidentId)

  if (error) {
    console.error('[updateIncidentField]', error)
    return { ok: false, error: "We couldn't apply that change. Try again." }
  }

  revalidatePath(`/incidents/${incidentId}`)
  revalidatePath('/dashboard')
  return { ok: true }
}
