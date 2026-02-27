import { JsonFile } from '@/types/json'

export function toggleCompareSelection(
  prev: [JsonFile | null, JsonFile | null],
  json: JsonFile,
): [JsonFile | null, JsonFile | null] {
  const [a, b] = prev
  // Already selected → remove it
  if (a?.id === json.id) return [null, b]
  if (b?.id === json.id) return [a, null]
  // Fill first empty slot
  if (a === null) return [json, b]
  if (b === null) return [a, json]
  // Both slots taken, do nothing
  return prev
}
