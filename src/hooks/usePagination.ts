'use client'

import { useState, useRef, useCallback } from 'react'
import JsonManager, { JsonOutput } from '@/services/JsonManager'

const ITEMS_PER_PAGE = 2

export interface UsePaginationReturn {
  data: JsonOutput
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  addItem: () => void
}

export function usePagination(jsonManager: JsonManager): UsePaginationReturn {
  const [data, setData] = useState<JsonOutput>([])
  const [hasMore, setHasMore] = useState(true)
  const maxItemRef = useRef<number | null>(null)
  const endIndexRef = useRef(ITEMS_PER_PAGE)

  const fetchData = useCallback((end: number) => {
    const result = jsonManager.getAllPaginated(0, end)

    if (!result) {
      setData([])
      setHasMore(false)
      return
    }

    maxItemRef.current = result.maxItem
    setData(result.data)
    setHasMore(end < result.maxItem)
  }, [jsonManager])

  const refresh = useCallback(() => {
    fetchData(endIndexRef.current)
  }, [fetchData])

  const loadMore = useCallback(() => {
    endIndexRef.current += ITEMS_PER_PAGE
    fetchData(endIndexRef.current)
  }, [fetchData])

  const addItem = useCallback(() => {
    endIndexRef.current += 1
    fetchData(endIndexRef.current)
  }, [fetchData])

  return {
    data,
    hasMore,
    loadMore,
    refresh,
    addItem,
  }
}