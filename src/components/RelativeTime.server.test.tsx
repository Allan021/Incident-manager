/**
 * @jest-environment node
 */
import { renderToString } from 'react-dom/server'
import { RelativeTime } from './RelativeTime'

const iso = new Date(Date.now() - 5 * 60000).toISOString()

describe('RelativeTime (server render)', () => {
  it('emits a deterministic UTC timestamp, never a relative label', () => {
    const html = renderToString(<RelativeTime iso={iso} />)
    expect(html).toContain(iso.slice(0, 16).replace('T', ' ') + 'Z')
    expect(html).not.toContain('min ago')
  })
})
