import { fireEvent, render, screen } from '@testing-library/react'
import { TabButton } from './TabButton'

describe('TabButton', () => {
  it('exposes selection through aria-selected', () => {
    const { rerender } = render(
      <TabButton label="Active" count={7} color="#ff6b63" selected={false} onSelect={() => {}} />,
    )
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'false')

    rerender(
      <TabButton label="Active" count={7} color="#ff6b63" selected={true} onSelect={() => {}} />,
    )
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true')
  })

  it('shows the label with its live count and fires onSelect', () => {
    const onSelect = jest.fn()
    render(
      <TabButton label="Resolved" count={2} color="#5fd39a" selected={false} onSelect={onSelect} />,
    )
    fireEvent.click(screen.getByRole('tab', { name: /Resolved 2/ }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
