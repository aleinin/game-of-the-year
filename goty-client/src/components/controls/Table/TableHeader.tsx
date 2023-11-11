import { Header } from './Table.types'

export interface TableHeaderProps<T> {
  headers: Header<T>[]
}

export const TableHeader = <T,>({ headers }: TableHeaderProps<T>) => (
  <thead>
    <tr>
      {headers.map((header) => (
        <th key={header.key}>{header.label}</th>
      ))}
    </tr>
  </thead>
)
