import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import JsonCompare from './JsonCompare'
import { JsonFile } from '@/types/json'

vi.mock('./DiffViewer', () => ({
  default: () => <div data-testid="diff-viewer" />,
}))

const makeJson = (id: string, title: string): JsonFile => ({ id, title, data: {} })

describe('JsonCompare', () => {
  it('shows placeholder with "0/2 selected" when no selection', () => {
    render(<JsonCompare jsonA={null} jsonB={null} />)
    expect(screen.getByText('0/2 selected in sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('diff-viewer')).not.toBeInTheDocument()
  })

  it('shows placeholder with "1/2 selected" when one JSON selected', () => {
    render(<JsonCompare jsonA={makeJson('a', 'First')} jsonB={null} />)
    expect(screen.getByText('1/2 selected in sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('diff-viewer')).not.toBeInTheDocument()
  })

  it('renders DiffViewer when both JSONs are selected', () => {
    render(<JsonCompare jsonA={makeJson('a', 'First')} jsonB={makeJson('b', 'Second')} />)
    expect(screen.getByTestId('diff-viewer')).toBeInTheDocument()
  })

  it('displays title A and title B in compare header', () => {
    render(<JsonCompare jsonA={makeJson('a', 'Alpha')} jsonB={makeJson('b', 'Beta')} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('does not render DiffViewer with only one JSON selected', () => {
    render(<JsonCompare jsonA={null} jsonB={makeJson('b', 'Second')} />)
    expect(screen.queryByTestId('diff-viewer')).not.toBeInTheDocument()
  })
})
