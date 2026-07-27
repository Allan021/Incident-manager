import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('offers to clear filters when filters caused the empty result', () => {
    render(<EmptyState hasFilters={true} tab="active" />)
    expect(screen.getByText('No incidents match your filters')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Clear filters' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })

  it('does not offer a clear action when there is nothing to clear', () => {
    render(<EmptyState hasFilters={false} tab="active" />)
    expect(screen.getByText('No active incidents')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
