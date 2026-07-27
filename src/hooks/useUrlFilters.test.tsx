import { fireEvent, render, screen } from '@testing-library/react'
import { useUrlFilters } from './useUrlFilters'

const push = jest.fn()
let params = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => params,
}))

function Probe() {
  const f = useUrlFilters()
  return (
    <>
      <span data-testid="tab">{f.tab}</span>
      <span data-testid="sev">{f.sev.join(',')}</span>
      <button onClick={() => f.toggle('sev', 'critical')}>toggle-critical</button>
      <button onClick={() => f.setTab('resolved')}>tab-resolved</button>
      <button onClick={() => f.setTab('active')}>tab-active</button>
      <button onClick={f.clear}>clear</button>
    </>
  )
}

describe('useUrlFilters', () => {
  beforeEach(() => {
    push.mockClear()
    params = new URLSearchParams()
  })

  it('adds a severity to the URL', () => {
    render(<Probe />)
    fireEvent.click(screen.getByText('toggle-critical'))
    expect(push).toHaveBeenCalledWith('/dashboard?sev=critical', { scroll: false })
  })

  it('removes an already-active severity', () => {
    params = new URLSearchParams('sev=critical,high')
    render(<Probe />)
    fireEvent.click(screen.getByText('toggle-critical'))
    expect(push).toHaveBeenCalledWith('/dashboard?sev=high', { scroll: false })
  })

  it('writes the resolved tab and drops the param for the default tab', () => {
    params = new URLSearchParams('tab=resolved')
    render(<Probe />)
    fireEvent.click(screen.getByText('tab-active'))
    expect(push).toHaveBeenCalledWith('/dashboard', { scroll: false })
  })

  it('clear removes filters but preserves the tab', () => {
    params = new URLSearchParams('tab=resolved&sev=critical&status=monitoring')
    render(<Probe />)
    fireEvent.click(screen.getByText('clear'))
    expect(push).toHaveBeenCalledWith('/dashboard?tab=resolved', { scroll: false })
  })

  it('reads current state from the URL', () => {
    params = new URLSearchParams('tab=resolved&sev=critical,low')
    render(<Probe />)
    expect(screen.getByTestId('tab')).toHaveTextContent('resolved')
    expect(screen.getByTestId('sev')).toHaveTextContent('critical,low')
  })
})
