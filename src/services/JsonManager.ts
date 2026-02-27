const STORAGE_KEY = 'json-saved'

export interface JsonInput {
  id: string
  title: string
  data: unknown
}

export type JsonInputWithDate = JsonInput & {
  lastUpdated: Date
}

export type JsonOutput = Array<JsonInputWithDate>

export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'StorageError'
  }
}

export default class JsonManager {
  /**
   * Save the JSON payload
   * @throws {StorageError} if localStorage quota is exceeded or unavailable
   */
  save(payload: JsonInput): void {
    try {
      const result = this.getAll() ?? {}

      const dataToInsert: JsonInputWithDate = {
        ...payload,
        lastUpdated: new Date(),
      }

      ;(result as Record<string, JsonInputWithDate>)[dataToInsert.id] = dataToInsert
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        throw new StorageError('Storage quota exceeded. Please delete some items.', e)
      }
      throw new StorageError('Failed to save item', e)
    }
  }

  get(id: string): JsonInputWithDate | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY)
      if (!item) {
        return null
      }
      const parsedResult = JSON.parse(item)
      return parsedResult[id] ?? null
    } catch {
      return null
    }
  }

  getAll(): Record<string, JsonInputWithDate> | null {
    try {
      const item = localStorage.getItem(STORAGE_KEY)
      if (!item) {
        return null
      }
      return JSON.parse(item)
    } catch {
      return null
    }
  }

  getAllPaginated(start: number, end: number): { maxItem: number; data: JsonOutput } | null {
    const items = this.getAll()
    if (!items) {
      return null
    }

    const itemEntries = Object.values(items)
    const paginatedItems = itemEntries
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated).getTime()
        const dateB = new Date(b.lastUpdated).getTime()
        return dateB - dateA
      })
      .slice(start, end)

    return {
      maxItem: itemEntries.length,
      data: paginatedItems,
    }
  }

  /**
   * Delete a JSON item by id
   * @throws {StorageError} if deletion fails
   */
  delete(id: string): void {
    try {
      const item = localStorage.getItem(STORAGE_KEY)
      if (!item) {
        return
      }
      const items = JSON.parse(item)
      delete items[id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      throw new StorageError('Failed to delete item', e)
    }
  }
}