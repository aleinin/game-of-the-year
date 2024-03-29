export interface Header<T> {
  label: string
  accessorFn: (row: T) => T[keyof T]
  key: string
  size?: string
}

export interface TableProps<T> {
  id: string
  headers: Header<T>[]
  rows: T[]
  rowsPerPageOptions: number[]
  rowStyleFn?: (row: T) => string
}
export type Primitive = string | number | boolean
