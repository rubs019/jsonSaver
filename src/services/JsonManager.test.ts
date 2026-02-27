import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import JsonManager, { StorageError } from './JsonManager'

const makePayload = (id = 'id-1', title = 'Test', data: unknown = { key: 'value' }) => ({
  id,
  title,
  data,
})

describe('JsonManager', () => {
  let manager: JsonManager

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    manager = new JsonManager()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // --- save ---
  describe('save()', () => {
    it('stores an item in localStorage', () => {
      manager.save(makePayload())
      const raw = localStorage.getItem('json-saved')
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw!)
      expect(parsed['id-1']).toBeDefined()
      expect(parsed['id-1'].title).toBe('Test')
    })

    it('updates an existing item', () => {
      manager.save(makePayload('id-1', 'First'))
      manager.save(makePayload('id-1', 'Updated'))
      const parsed = JSON.parse(localStorage.getItem('json-saved')!)
      expect(parsed['id-1'].title).toBe('Updated')
      expect(Object.keys(parsed)).toHaveLength(1)
    })

    it('adds lastUpdated to the saved item', () => {
      manager.save(makePayload())
      const parsed = JSON.parse(localStorage.getItem('json-saved')!)
      expect(parsed['id-1'].lastUpdated).toBeDefined()
    })

    it('throws StorageError on QuotaExceededError', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const err = new DOMException('quota', 'QuotaExceededError')
        throw err
      })
      expect(() => manager.save(makePayload())).toThrow(StorageError)
      expect(() => manager.save(makePayload())).toThrow('Storage quota exceeded')
    })

    it('throws StorageError on generic error', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Disk failure')
      })
      expect(() => manager.save(makePayload())).toThrow(StorageError)
      expect(() => manager.save(makePayload())).toThrow('Failed to save item')
    })
  })

  // --- get ---
  describe('get()', () => {
    it('returns null when storage is empty', () => {
      expect(manager.get('id-1')).toBeNull()
    })

    it('returns null for unknown id', () => {
      manager.save(makePayload('id-1'))
      expect(manager.get('unknown')).toBeNull()
    })

    it('returns the correct item', () => {
      manager.save(makePayload('id-1', 'Hello'))
      const result = manager.get('id-1')
      expect(result).not.toBeNull()
      expect(result!.title).toBe('Hello')
    })
  })

  // --- getAll ---
  describe('getAll()', () => {
    it('returns null when storage is empty', () => {
      expect(manager.getAll()).toBeNull()
    })

    it('returns all saved items', () => {
      manager.save(makePayload('id-1'))
      manager.save(makePayload('id-2', 'Second'))
      const result = manager.getAll()
      expect(result).not.toBeNull()
      expect(Object.keys(result!)).toHaveLength(2)
    })
  })

  // --- getAllPaginated ---
  describe('getAllPaginated()', () => {
    it('returns null when storage is empty', () => {
      expect(manager.getAllPaginated(0, 5)).toBeNull()
    })

    it('sorts items newest-first', async () => {
      manager.save(makePayload('id-old', 'Old'))
      // Small delay to ensure different timestamps
      await new Promise((r) => setTimeout(r, 5))
      manager.save(makePayload('id-new', 'New'))

      const result = manager.getAllPaginated(0, 10)
      expect(result!.data[0].id).toBe('id-new')
      expect(result!.data[1].id).toBe('id-old')
    })

    it('respects start/end slice', () => {
      manager.save(makePayload('id-1'))
      manager.save(makePayload('id-2'))
      manager.save(makePayload('id-3'))

      const result = manager.getAllPaginated(0, 2)
      expect(result!.data).toHaveLength(2)
    })

    it('maxItem reflects total count, not just the page', () => {
      manager.save(makePayload('id-1'))
      manager.save(makePayload('id-2'))
      manager.save(makePayload('id-3'))

      const result = manager.getAllPaginated(0, 2)
      expect(result!.maxItem).toBe(3)
    })
  })

  // --- delete ---
  describe('delete()', () => {
    it('removes the specified item', () => {
      manager.save(makePayload('id-1'))
      manager.save(makePayload('id-2'))
      manager.delete('id-1')
      expect(manager.get('id-1')).toBeNull()
    })

    it('does not touch other items', () => {
      manager.save(makePayload('id-1'))
      manager.save(makePayload('id-2'))
      manager.delete('id-1')
      expect(manager.get('id-2')).not.toBeNull()
    })

    it('does not throw if id does not exist', () => {
      manager.save(makePayload('id-1'))
      expect(() => manager.delete('non-existent')).not.toThrow()
    })

    it('does not throw if storage is empty', () => {
      expect(() => manager.delete('id-1')).not.toThrow()
    })
  })
})
