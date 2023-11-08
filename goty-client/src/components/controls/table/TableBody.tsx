import { render } from './render'
import { Header, TableProps } from './Table.types'
import styled from 'styled-components'

const TrStyle = styled.tr``

const TdStyle = styled.td`
  font-size: 0.8em;
  padding: 10px;
`
export interface TableBodyProps<T> {
  id: string
  headers: Header<T>[]
  rows: T[]
}

export const TableBody = <T,>({ rows, headers, id }: TableBodyProps<T>) => {
  return (
    <tbody>
      {rows.map((row, rowIndex) => (
        <TrStyle key={`${id}-row${rowIndex}`}>
          {headers.map((header, columnIndex) => (
            <TdStyle key={`${id}-row${rowIndex}-column${columnIndex}`}>
              {render(header.accessorFn(row))}
            </TdStyle>
          ))}
        </TrStyle>
      ))}
    </tbody>
  )
}
