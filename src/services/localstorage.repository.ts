export default class LocalstorageRepository {
  DEFAULT_ID = '1'

  getAll(): string | null {
    const json = window.localStorage.getItem(this.DEFAULT_ID)
    if (!json) {
      console.log('No local storage returned')
    }
    return json
  }

  save(id: string, item: any) {
    window.localStorage.setItem(id, JSON.stringify(item))
  }

  clear(id: string) {
    window.localStorage.removeItem(id)
  }
}
