import { render } from './render'
import { Header } from './Table.types'

export interface TableBodyProps<T> {
  id: string
  headers: Header<T>[]
  rows: T[]
  rowStyleFn?: (row: T) => string
}

export const TableBody = <T,>({
  rows,
  headers,
  id,
  rowStyleFn,
}: TableBodyProps<T>) => {
  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td>No results yet</td>
        </tr>
      </tbody>
    )
  }
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr
          key={`${id}-row${rowIndex}`}
          className={rowStyleFn ? rowStyleFn(row) : ''}
        >
          {headers.map((header, columnIndex) => (
            <td key={`${id}-row${rowIndex}-column${columnIndex}`}>
              {render(header.accessorFn(row))}{' '}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
