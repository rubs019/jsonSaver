export interface JsonFile {
  id: string
  title: string
  data: unknown
}

export enum EditStatus {
  view = 'view',
  new = 'new',
  compare = 'compare',
}