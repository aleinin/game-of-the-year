import styled from 'styled-components'
import { TableProps } from './Table.types'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TablePaginator } from './TablePaginator'
import { useState } from 'react'

const TableStyle = styled.table`
  width: 100%;
`

const TableContainer = styled.div``

export const Table = <T = any,>({
  id,
  headers,
  rows,
  rowsPerPageOptions,
}: TableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0])
  const totalPages = Math.ceil(rows.length / rowsPerPage)
  const startIndex = rowsPerPage * pageIndex
  const shownRows = rows.slice(startIndex, startIndex + rowsPerPage)
  if (rows.length === 0) {
    return (
      <TableContainer style={{ marginTop: '10px', fontSize: '0.8em' }}>
        No results found
      </TableContainer>
    )
  }
  return (
    <TableContainer>
      <TableStyle>
        <TableHeader headers={headers} />
        <TableBody id={id} headers={headers} rows={shownRows} />
      </TableStyle>
      <TablePaginator
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        totalPages={totalPages}
        setPage={setPageIndex}
        setRowsPerPage={setRowsPerPage}
      />
    </TableContainer>
  )
}
