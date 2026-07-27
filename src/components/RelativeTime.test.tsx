import { render, screen } from '@testing-library/react'
import { RelativeTime } from './RelativeTime'

const iso = new Date(Date.now() - 5 * 60000).toISOString()

describe('RelativeTime (client)', () => {
  it('upgrades to a relative label after mount', () => {
    render(<RelativeTime iso={iso} />)
    expect(screen.getByText('5 min ago')).toBeInTheDocument()
  })

  it('keeps the machine-readable datetime attribute', () => {
    render(<RelativeTime iso={iso} />)
    expect(screen.getByText('5 min ago')).toHaveAttribute('dateTime', iso)
  })
})
