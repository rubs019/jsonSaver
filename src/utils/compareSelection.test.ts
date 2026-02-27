import { describe, it, expect } from 'vitest'
import { toggleCompareSelection } from './compareSelection'
import { JsonFile } from '@/types/json'

const makeJson = (id: string): JsonFile => ({ id, title: `Item ${id}`, data: {} })

const A = makeJson('a')
const B = makeJson('b')
const C = makeJson('c')

describe('toggleCompareSelection', () => {
  it('places first item in slot A when both slots are empty', () => {
    const result = toggleCompareSelection([null, null], A)
    expect(result).toEqual([A, null])
  })

  it('places second item in slot B when A is taken', () => {
    const result = toggleCompareSelection([A, null], B)
    expect(result).toEqual([A, B])
  })

  it('removes item from slot A, keeps slot B', () => {
    const result = toggleCompareSelection([A, B], A)
    expect(result).toEqual([null, B])
  })

  it('removes item from slot B, keeps slot A', () => {
    const result = toggleCompareSelection([A, B], B)
    expect(result).toEqual([A, null])
  })

  it('fills slot A when B is taken and A is empty', () => {
    const result = toggleCompareSelection([null, B], C)
    expect(result).toEqual([C, B])
  })

  it('does nothing when both slots are taken and item is not selected', () => {
    const prev: [JsonFile | null, JsonFile | null] = [A, B]
    const result = toggleCompareSelection(prev, C)
    expect(result).toBe(prev)
  })
})
