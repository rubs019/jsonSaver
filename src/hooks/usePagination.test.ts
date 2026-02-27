import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePagination } from './usePagination'
import JsonManager from '@/services/JsonManager'

function makeManager(overrides: Partial<JsonManager> = {}): JsonManager {
  return {
    getAllPaginated: vi.fn().mockReturnValue(null),
    save: vi.fn(),
    get: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  } as unknown as JsonManager
}

function makeItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `id-${i}`,
    title: `Item ${i}`,
    data: {},
    lastUpdated: new Date(),
  }))
}

describe('usePagination', () => {
  it('starts with empty data', () => {
    const manager = makeManager()
    const { result } = renderHook(() => usePagination(manager))
    expect(result.current.data).toEqual([])
  })

  it('loads data on refresh()', () => {
    const items = makeItems(3)
    const manager = makeManager({
      getAllPaginated: vi.fn().mockReturnValue({ maxItem: 3, data: items }),
    })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })

    expect(result.current.data).toHaveLength(3)
  })

  it('hasMore is false when all items fit in the window', () => {
    const items = makeItems(2)
    const manager = makeManager({
      getAllPaginated: vi.fn().mockReturnValue({ maxItem: 2, data: items }),
    })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })

    expect(result.current.hasMore).toBe(false)
  })

  it('hasMore is true when more items exist beyond the window', () => {
    const items = makeItems(2)
    const manager = makeManager({
      getAllPaginated: vi.fn().mockReturnValue({ maxItem: 5, data: items }),
    })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })

    expect(result.current.hasMore).toBe(true)
  })

  it('loadMore() extends the window and fetches more data', () => {
    const allItems = makeItems(4)
    const getPaginated = vi.fn()
      .mockReturnValueOnce({ maxItem: 4, data: allItems.slice(0, 2) })
      .mockReturnValueOnce({ maxItem: 4, data: allItems })

    const manager = makeManager({ getAllPaginated: getPaginated })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })
    expect(result.current.data).toHaveLength(2)

    act(() => { result.current.loadMore() })
    expect(result.current.data).toHaveLength(4)
  })

  it('addItem() increments window by 1', () => {
    const allItems = makeItems(3)
    const getPaginated = vi.fn()
      .mockReturnValueOnce({ maxItem: 3, data: allItems.slice(0, 2) })
      .mockReturnValueOnce({ maxItem: 3, data: allItems })

    const manager = makeManager({ getAllPaginated: getPaginated })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })
    act(() => { result.current.addItem() })

    expect(result.current.data).toHaveLength(3)
    // Second call should have been made with end = 3 (2 + 1)
    const calls = (getPaginated as ReturnType<typeof vi.fn>).mock.calls
    expect(calls[1][1]).toBe(3)
  })

  it('handles null result from manager gracefully', () => {
    const manager = makeManager({
      getAllPaginated: vi.fn().mockReturnValue(null),
    })
    const { result } = renderHook(() => usePagination(manager))

    act(() => { result.current.refresh() })

    expect(result.current.data).toEqual([])
    expect(result.current.hasMore).toBe(false)
  })
})
