import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ToastProvider } from '@/components/toast'
import { updateIncidentField } from '../actions'
import { IncidentControls } from './IncidentControls'

jest.mock('../actions', () => ({
  updateIncidentField: jest.fn(),
}))

const mockUpdate = updateIncidentField as jest.Mock

function renderControls() {
  return render(
    <ToastProvider>
      <IncidentControls incidentId="INC-1" status="investigating" severity="high" />
    </ToastProvider>,
  )
}

describe('IncidentControls', () => {
  beforeEach(() => mockUpdate.mockReset())

  it('applies the change optimistically and confirms with a toast on success', async () => {
    mockUpdate.mockResolvedValue({ ok: true })
    renderControls()

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'monitoring' } })

    expect(mockUpdate).toHaveBeenCalledWith('INC-1', 'status', 'monitoring')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Incident updated'))
  })

  it('rolls back to the server value and shows the error when the action fails', async () => {
    mockUpdate.mockResolvedValue({ ok: false, error: "We couldn't apply that change. Try again." })
    renderControls()

    fireEvent.change(screen.getByLabelText('Severity'), { target: { value: 'critical' } })

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent("We couldn't apply that change"),
    )
    await waitFor(() => expect(screen.getByLabelText('Severity')).toHaveValue('high'))
  })
})
