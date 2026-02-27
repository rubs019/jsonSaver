import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import JsonCreate from './jsonCreate'
import { EditStatus } from '@/types/json'

// Mock the JsonEditor (heavy dynamic import, not needed for logic tests)
vi.mock('@/components/jsonEditor', () => ({
  default: ({ onChange }: { onChange: (v: string) => void }) => (
    <div
      data-testid="json-editor"
      onClick={() => onChange(JSON.stringify({ mocked: true }))}
    />
  ),
}))

// Mock use-toast
const mockToast = vi.fn()
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

beforeEach(() => {
  mockToast.mockClear()
})

describe('JsonCreate', () => {
  it('shows empty state when mode=view and no data', () => {
    render(<JsonCreate mode={EditStatus.view} />)
    expect(screen.getByText('No JSON selected')).toBeInTheDocument()
  })

  it('shows editor in mode=new', () => {
    render(<JsonCreate mode={EditStatus.new} />)
    expect(screen.getByTestId('json-editor')).toBeInTheDocument()
  })

  it('shows title error when saving without a title', async () => {
    render(<JsonCreate mode={EditStatus.new} />)
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    expect(screen.getByText('Title required')).toBeInTheDocument()
  })

  it('calls onAdd when title is filled and save is clicked', async () => {
    const onAdd = vi.fn()
    render(<JsonCreate mode={EditStatus.new} onAdd={onAdd} />)

    await userEvent.type(screen.getByPlaceholderText('JSON title…'), 'My JSON')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd.mock.calls[0][0].title).toBe('My JSON')
  })

  it('save button is disabled when title is cleared', async () => {
    render(<JsonCreate mode={EditStatus.new} />)
    const input = screen.getByPlaceholderText('JSON title…')

    await userEvent.type(input, 'Hello')
    await userEvent.clear(input)

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled()
  })

  it('delete button is disabled in mode=new', () => {
    render(<JsonCreate mode={EditStatus.new} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
  })

  it('delete button is enabled in mode=view with data', () => {
    const data = { id: 'id-1', title: 'My JSON', data: {} }
    render(<JsonCreate mode={EditStatus.view} data={data} />)
    expect(screen.getByRole('button', { name: /delete/i })).not.toBeDisabled()
  })
})
