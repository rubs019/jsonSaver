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
    const result = this.getAll()
    if (!result) {
      console.log('No local storage returned')
      return
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
