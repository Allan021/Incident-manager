import { act, fireEvent, render, screen } from '@testing-library/react'
import { ToastProvider, useToast } from './ToastProvider'

function Trigger() {
  const toast = useToast()
  return (
    <button onClick={() => toast({ type: 'ok', msg: 'Update posted' })}>notify</button>
  )
}

describe('ToastProvider', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('announces a toast through role=status without stealing focus', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    const button = screen.getByText('notify')
    button.focus()
    fireEvent.click(button)

    expect(screen.getByRole('status')).toHaveTextContent('Update posted')
    expect(button).toHaveFocus()
  })

  it('auto-dismisses after five seconds', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByText('notify'))
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
