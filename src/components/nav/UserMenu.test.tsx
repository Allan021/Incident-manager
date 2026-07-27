import { fireEvent, render, screen } from '@testing-library/react'
import { UserMenu } from './UserMenu'

const user = { name: 'Alex Rivera', email: 'alex@kizerwatch.dev' }

describe('UserMenu', () => {
  it('opens on click and exposes expanded state', () => {
    render(<UserMenu user={user} />)
    const trigger = screen.getByRole('button', { name: 'User menu' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('alex@kizerwatch.dev')).toBeInTheDocument()
  })

  it('closes on Escape', () => {
    render(<UserMenu user={user} />)
    fireEvent.click(screen.getByRole('button', { name: 'User menu' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on outside click', () => {
    render(<UserMenu user={user} />)
    fireEvent.click(screen.getByRole('button', { name: 'User menu' }))
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('signs out through a native POST form, not JavaScript', () => {
    render(<UserMenu user={user} />)
    fireEvent.click(screen.getByRole('button', { name: 'User menu' }))
    const form = screen.getByRole('menuitem', { name: 'Sign out' }).closest('form')
    expect(form).toHaveAttribute('action', '/auth/sign-out')
    expect(form).toHaveAttribute('method', 'post')
  })
})
