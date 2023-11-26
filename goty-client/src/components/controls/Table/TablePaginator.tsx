import { Paginator } from '../Paginator/Paginator'
import { Dropdown } from '../Dropdown/Dropdown'
import styles from './Table.module.scss'

export interface TablePaginatorProps {
  pageIndex: number
  rowsPerPage: number
  rowsPerPageOptions: number[]
  totalPages: number
  setPage: (pageIndex: number) => void
  setRowsPerPage: (rowsPerPage: number) => void
  disabled?: boolean
}

export const TablePaginator = ({
  pageIndex,
  rowsPerPage,
  rowsPerPageOptions,
  setRowsPerPage,
  totalPages,
  setPage,
  disabled = false,
}: TablePaginatorProps) => {
  return (
    <div className={styles.paginatorContainer}>
      <div className={styles.tablePaginator}>
        <Paginator
          totalPages={totalPages}
          pageIndex={pageIndex}
          setIndex={setPage}
        />
      </div>
      <Dropdown<number>
        disabled={disabled}
        value={rowsPerPage}
        options={rowsPerPageOptions}
        onChange={setRowsPerPage}
        width={'65px'}
        accessorFn={(value) => `${value}`}
      />
    </div>
  )
}
