import { render, screen } from '@testing-library/react'
import { SEV, ST } from '@/lib/domain'
import { Badge } from './Badge'

describe('Badge', () => {
  it('conveys status with a text label, not colour alone', () => {
    render(<Badge meta={SEV.critical} />)
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('pairs every label with a shape-distinct icon hidden from screen readers', () => {
    const { container } = render(<Badge meta={ST.monitoring} />)
    const icon = container.querySelector('svg')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon?.querySelector('path')).toHaveAttribute('d', ST.monitoring.icon)
  })
})
