import { render, screen } from '@testing-library/react'
import { UpdateItem, type FeedItem } from './UpdateItem'

const base: FeedItem = {
  id: 'u1',
  incident_id: 'INC-1',
  author_id: 'a1',
  author_name: 'Maya Chen',
  message: 'Rolling back the 14:00 deploy.',
  created_at: new Date().toISOString(),
}

describe('UpdateItem', () => {
  it('renders the author and message', () => {
    render(<UpdateItem update={base} />)
    expect(screen.getByText('Maya Chen')).toBeInTheDocument()
    expect(screen.getByText('Rolling back the 14:00 deploy.')).toBeInTheDocument()
  })

  it('marks an optimistic row as pending', () => {
    render(<UpdateItem update={{ ...base, pending: true }} />)
    expect(screen.getByText('Sending…')).toBeInTheDocument()
  })

  it('does not show a pending marker on settled rows', () => {
    render(<UpdateItem update={base} />)
    expect(screen.queryByText('Sending…')).not.toBeInTheDocument()
  })
})
