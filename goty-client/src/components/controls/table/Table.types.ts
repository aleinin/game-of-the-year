export interface Header<T> {
  label: string
  accessorFn: (row: T) => T[keyof T]
  key: string
}

export interface TableProps<T> {
  id: string
  headers: Header<T>[]
  rows: T[]
  rowsPerPageOptions: number[]
}
export type Primitive = string | number | boolean
