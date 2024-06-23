import {JsonFile} from "@/app/page";


export type JsonInput = {
  id: string
  title: string
  data: unknown
}

export type JsonInputWithDate = JsonInput & {
  lastUpdated: Date
}

export type JsonOutput = {
  [key: string]: JsonInputWithDate
}
export default class JsonManager {
  save(payload: JsonInput): void {
    let result = this.getAll()
    if (!result) {
      console.log('No local storage returned, this should be the first record')
      result = {} as JsonOutput
    }
    const dataToInsert = payload as unknown as JsonInputWithDate
    dataToInsert.lastUpdated = new Date()
    result[payload.id] = dataToInsert
    localStorage.setItem('json-saved', JSON.stringify(result))
  }

  get(id: string): string | null {
    const item = localStorage.getItem('json-saved')
    if (!item) {
      console.log('No local storage returned')
      return null
    }
    const parsedResult = JSON.parse(item)
    return parsedResult[id] || null
  }

  getAll(): JsonOutput | null {
    try {
      const item = localStorage.getItem('json-saved')

      if (!item) {
        console.log('No item was founded')
        return null
      }
      return JSON.parse(item)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  getAllPaginated(start: number, end: number): { maxItem: number, currentLength: number, data: JsonOutput } | null {
    const items = this.getAll()
    if (!items) {
      console.log('No item was founded')
      return null
    }
    const itemEntries = Object.entries(items)
    const paginatedItems = itemEntries
        .sort((a, b) => {
          return a[1].lastUpdated < b[1].lastUpdated ? 1 : -1
        })
        .slice(start, end)
        .reduce((a, v) => ({ ...a, [v[0]]: v[1]}), {})
    
    console.log('paginatedItems', paginatedItems)
    return {
      maxItem: itemEntries.length,
      currentLength: Object.entries(paginatedItems).length,
      data: paginatedItems
    }
  }

  delete(id: string): void {
    try {
      const item = localStorage.getItem('json-saved')

      if (!item) {
        console.log('No item was founded')
        return
      }
      const items = JSON.parse(item)
      delete items[id]
      localStorage.setItem('json-saved', JSON.stringify(items))
    } catch (e) {
      console.log(e)
      return
    }
  }
}
