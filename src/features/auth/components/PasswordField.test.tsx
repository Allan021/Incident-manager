import { fireEvent, render, screen } from '@testing-library/react'
import { PasswordField } from './PasswordField'

describe('PasswordField', () => {
  it('hides the password by default', () => {
    const { container } = render(<PasswordField />)
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('toggles visibility with an accessible state', () => {
    const { container } = render(<PasswordField />)
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))

    expect(container.querySelector('input')).toHaveAttribute('type', 'text')
    const toggle = screen.getByRole('button', { name: 'Hide password' })
    expect(toggle).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(toggle)
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
  })

  it('keeps the typed value across toggles', () => {
    const { container } = render(<PasswordField />)
    const input = container.querySelector('input')!
    fireEvent.change(input, { target: { value: 'hunter2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveValue('hunter2')
  })
})
