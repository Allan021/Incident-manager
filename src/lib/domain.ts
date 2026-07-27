import { avatarHues, palette } from './tokens'

export const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const
export const STATUSES = ['investigating', 'identified', 'monitoring', 'resolved'] as const

export type Severity = (typeof SEVERITIES)[number]
export type Status = (typeof STATUSES)[number]

export type Meta = { label: string; color: string; icon: string; desc: string }

export const SEV: Record<Severity, Meta> = {
  critical: {
    label: 'Critical',
    color: palette.critical,
    icon: 'M8 2.5 14.5 13.5H1.5Z M8 7v2.6 M8 11.7v.01',
    desc: 'Customer-facing outage or data risk. All hands: page the on-call lead immediately, updates at least every 30 minutes.',
  },
  high: {
    label: 'High',
    color: palette.high,
    icon: 'M3.5 10.5 8 6l4.5 4.5',
    desc: 'Major degradation affecting a significant share of users or a core workflow. Active response required during business and on-call hours.',
  },
  medium: {
    label: 'Medium',
    color: palette.medium,
    icon: 'M4 6.5h8 M4 9.5h8',
    desc: 'Partial degradation with a workaround, or an internal-only impact. Handled within the working day.',
  },
  low: {
    label: 'Low',
    color: palette.low,
    icon: 'M3.5 6 8 10.5 12.5 6',
    desc: 'Minor issue, cosmetic bug, or preventive investigation. Scheduled into normal work, no paging.',
  },
}

export const ST: Record<Status, Meta> = {
  investigating: {
    label: 'Investigating',
    color: palette.investigating,
    icon: 'M11.6 11.6 14.5 14.5 M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10Z',
    desc: 'We know something is wrong and are actively looking for the root cause.',
  },
  identified: {
    label: 'Identified',
    color: palette.identified,
    icon: 'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z M8 10.5A2.5 2.5 0 1 0 8 5.5a2.5 2.5 0 0 0 0 5Z',
    desc: 'Root cause found. A fix or mitigation is being prepared or rolled out.',
  },
  monitoring: {
    label: 'Monitoring',
    color: palette.monitoring,
    icon: 'M1.5 8h3L6.5 4.5l3 7 2-3.5h3',
    desc: 'A fix has been applied. We are watching metrics to confirm full recovery before resolving.',
  },
  resolved: {
    label: 'Resolved',
    color: palette.success,
    icon: 'M2.5 8.5 6.5 12.5 13.5 4',
    desc: 'Impact has ended and recovery is confirmed. A post-incident review may follow.',
  },
}

export const SEV_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }

export function isSeverity(v: unknown): v is Severity {
  return typeof v === 'string' && (SEVERITIES as readonly string[]).includes(v)
}
export function isStatus(v: unknown): v is Status {
  return typeof v === 'string' && (STATUSES as readonly string[]).includes(v)
}

export function badge(color: string) {
  return { bg: color + '1f', border: color + '59', fg: color }
}

const AVATAR_BG = avatarHues

export function avatarBg(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_BG[h % AVATAR_BG.length]
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
