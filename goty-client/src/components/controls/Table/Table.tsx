import { Header, TableProps } from './Table.types'
import { TablePaginator } from './TablePaginator'
import { useEffect, useRef, useState } from 'react'
import styles from './Table.module.scss'
import { render } from './render'
import classNames from 'classnames'

const rowHeightPx = 50
export const Table = <T = any,>({
  id,
  headers,
  rows,
  rowsPerPageOptions,
  rowStyleFn,
}: TableProps<T>) => {
  const header = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0])
  const handleSetRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPageIndex(0)
  }
  const totalPages = Math.ceil(rows.length / rowsPerPage)
  const startIndex = rowsPerPage * pageIndex
  const shownRows = rows.slice(startIndex, startIndex + rowsPerPage)
  useEffect(() => {
    setPageIndex(0)
  }, [rows, headers])
  useEffect(() => {
    const headerElement = header.current
    const bodyElement = body.current
    if (headerElement != null && bodyElement != null) {
      const size = headers
        .map((header) => header.size ?? '1fr')
        .filter((header): header is string => header != null)
      const gridTemplateColumns = `${size.join(' ')}`
      headerElement.style.gridTemplateColumns = gridTemplateColumns
      if (rows.length > 0) {
        bodyElement.style.gridTemplateColumns = gridTemplateColumns
        if (totalPages > 1) {
          bodyElement.style.minHeight = `${rowHeightPx * rowsPerPage}px`
        } else {
          bodyElement.style.removeProperty('min-height')
        }
      } else {
        bodyElement.style.removeProperty('grid-template-columns')
        bodyElement.style.removeProperty('min-height')
      }
    }
  }, [headers, header, body, rowsPerPage, rows, totalPages])

  return (
    <div className={styles.table}>
      <div ref={header} className={styles.header}>
        <TableHeader headers={headers} />
      </div>
      <div ref={body} className={styles.body}>
        <TableBody
          id={id}
          headers={headers}
          rows={shownRows}
          rowStyleFn={rowStyleFn}
        />
      </div>
      <TablePaginator
        pageIndex={pageIndex}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        totalPages={totalPages}
        setPage={setPageIndex}
        setRowsPerPage={handleSetRowsPerPage}
        disabled={rows.length === 0}
      />
    </div>
  )
}

interface TableHeaderProps<T> {
  headers: Header<T>[]
}

const TableHeader = <T,>({ headers }: TableHeaderProps<T>) => (
  <>
    {headers.map((header) => (
      <div className={styles.cell} key={header.key}>
        {header.label}
      </div>
    ))}
  </>
)

interface TableBodyProps<T> {
  id: string
  headers: Header<T>[]
  rows: T[]
  rowStyleFn?: (row: T) => string
}
const TableBody = <T,>({
  rows,
  headers,
  id,
  rowStyleFn,
}: TableBodyProps<T>) => {
  if (rows.length === 0) {
    return <div className={styles.noResults}>No results yet</div>
  }
  return (
    <>
      {rows.map((row, rowIndex) =>
        headers.map((header, columnIndex) => (
          <div
            className={classNames(styles.cell, rowStyleFn && rowStyleFn(row))}
            key={`${id}-row${rowIndex}-column${columnIndex}`}
          >
            {render(header.accessorFn(row))}
          </div>
        )),
      )}
    </>
  )
}
