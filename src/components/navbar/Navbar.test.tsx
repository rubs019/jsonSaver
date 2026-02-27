import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'
import { EditStatus } from '@/types/json'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const defaultProps = {
  onCreateNew: vi.fn(),
  onEnterCompare: vi.fn(),
  onExitCompare: vi.fn(),
}

describe('Navbar', () => {
  it('shows Compare and New JSON buttons in normal mode', () => {
    render(<Navbar {...defaultProps} mode={EditStatus.new} />)
    expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new json/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /exit compare/i })).not.toBeInTheDocument()
  })

  it('shows Exit Compare button in compare mode, hides others', () => {
    render(<Navbar {...defaultProps} mode={EditStatus.compare} />)
    expect(screen.getByRole('button', { name: /exit compare/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^compare$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /new json/i })).not.toBeInTheDocument()
  })

  it('calls onEnterCompare when Compare is clicked', async () => {
    const onEnterCompare = vi.fn()
    render(<Navbar {...defaultProps} onEnterCompare={onEnterCompare} mode={EditStatus.new} />)
    await userEvent.click(screen.getByRole('button', { name: /compare/i }))
    expect(onEnterCompare).toHaveBeenCalledOnce()
  })

  it('calls onExitCompare when Exit Compare is clicked', async () => {
    const onExitCompare = vi.fn()
    render(<Navbar {...defaultProps} onExitCompare={onExitCompare} mode={EditStatus.compare} />)
    await userEvent.click(screen.getByRole('button', { name: /exit compare/i }))
    expect(onExitCompare).toHaveBeenCalledOnce()
  })

  it('calls onCreateNew when New JSON is clicked', async () => {
    const onCreateNew = vi.fn()
    render(<Navbar {...defaultProps} onCreateNew={onCreateNew} mode={EditStatus.new} />)
    await userEvent.click(screen.getByRole('button', { name: /new json/i }))
    expect(onCreateNew).toHaveBeenCalledOnce()
  })
})
