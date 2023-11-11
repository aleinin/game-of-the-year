import { TableProps } from './Table.types'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TablePaginator } from './TablePaginator'
import { useState } from 'react'
import styles from './Table.module.scss'

export const Table = <T = any,>({
  id,
  headers,
  rows,
  rowsPerPageOptions,
  rowStyleFn,
}: TableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0])
  const totalPages = Math.ceil(rows.length / rowsPerPage)
  const startIndex = rowsPerPage * pageIndex
  const shownRows = rows.slice(startIndex, startIndex + rowsPerPage)
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <TableHeader headers={headers} />
        <TableBody
          id={id}
          headers={headers}
          rows={shownRows}
          rowStyleFn={rowStyleFn}
        />
      </table>
      <TablePaginator
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        totalPages={totalPages}
        setPage={setPageIndex}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  )
}
