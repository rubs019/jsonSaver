export interface JsonInput {
  id: string
  title: string
  data: unknown
}

export type JsonInputWithDate = JsonInput & {
  lastUpdated: Date
}

export type JsonOutput = Array<JsonInputWithDate>

export default class JsonManager {
  /**
   * Save the JSON payload 
   */
  save(payload: JsonInput): void {
    /* if no local storage returned, this should be the first record */
    let result = this.getAll() || {} as JsonOutput
    
    const dataToInsert = payload as unknown as JsonInputWithDate
    dataToInsert.lastUpdated = new Date()
    const id = dataToInsert.id
    console.log("payload", payload, id)
    console.log("result previous", result)
    // @ts-ignore
    result[dataToInsert.id] = dataToInsert
    console.log("result", result)
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
    let paginatedItems = itemEntries
        .map((value) => value[1])
        .sort((a, b) => {
          return a.lastUpdated < b.lastUpdated ? 1 : -1
        })
        .slice(start, end)
    
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
