export function ago(iso: string): string {
  const m = Math.floor((Date.now() - +new Date(iso)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function utcShort(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + 'Z'
}

export function absoluteUtc(iso: string): string {
  return new Date(iso).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
}
