import styled from 'styled-components'
import { Paginator } from '../Paginator'
import { Dropdown } from '../dropdown/Dropdown'

export interface TablePaginatorProps {
  pageIndex: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  totalPages: number
  setPage: (pageIndex: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
}

const TablePaginatorStyle = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`

export const TablePaginator = ({
  pageIndex,
  rowsPerPage,
  rowsPerPageOptions,
  setRowsPerPage,
  totalPages,
  setPage,
}: TablePaginatorProps) => {
  return (
    <TablePaginatorStyle>
      <Paginator
        totalPages={totalPages}
        pageIndex={pageIndex}
        setIndex={setPage}
      />
      <Dropdown<number>
        value={rowsPerPage}
        options={rowsPerPageOptions}
        onChange={setRowsPerPage}
        width={'65px'}
        accessorFn={(value) => `${value}`}
      />
    </TablePaginatorStyle>
  )
}
