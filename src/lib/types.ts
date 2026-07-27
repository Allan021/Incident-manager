import type { Severity, Status } from './domain'

export type Profile = {
  id: string
  name: string
  email: string | null
  avatar_url: string | null
}

export type Incident = {
  id: string
  title: string
  description: string
  severity: Severity
  status: Status
  owner_id: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  owner: Pick<Profile, 'id' | 'name'> | null
  update_count: number
}

export type IncidentUpdate = {
  id: string
  incident_id: string
  author_id: string | null
  message: string
  created_at: string
  author_name: string
}

export type Stats = {
  open: number
  criticals: number
  resolvedLastWeek: number
  mttrMinutes: number | null
}
