import { fireEvent, render, screen } from '@testing-library/react'
import { SEV } from '@/lib/domain'
import { FilterChip } from './FilterChip'

describe('FilterChip', () => {
  it('exposes its toggle state through aria-pressed', () => {
    const { rerender } = render(
      <FilterChip meta={SEV.high} on={false} count={3} onToggle={() => {}} />,
    )
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')

    rerender(<FilterChip meta={SEV.high} on={true} count={3} onToggle={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the label and the live count', () => {
    render(<FilterChip meta={SEV.critical} on={false} count={2} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /Critical 2/ })).toBeInTheDocument()
  })

  it('invokes onToggle on click', () => {
    const onToggle = jest.fn()
    render(<FilterChip meta={SEV.low} on={false} count={0} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
