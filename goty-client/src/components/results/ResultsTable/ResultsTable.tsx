import { Card } from '../../controls/Card/Card'
import { Table } from '../../controls/Table/Table'
import { Header } from '../../controls/Table/Table.types'
import styles from './ResultsTable.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCallback, useEffect } from 'react'

export interface ResultsTableProps<T> {
  id: string
  headers: Header<T>[]
  title: string
  rows: T[]
  rowStyleFn?: (row: T) => string
}

export const ResultsTable = <T,>(props: ResultsTableProps<T>) => {
  const navigate = useNavigate()
  const location = useLocation()
  const scrollToTable = useCallback(() => {
    const windowHash = location.hash.slice(1)
    if (windowHash === props.id) {
      document.getElementById(windowHash)?.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
      })
    }
  }, [location, props.id])
  useEffect(() => {
    scrollToTable()
  }, [scrollToTable])
  return (
    <Card
      id={props.id}
      title={props.title}
      index={`${props.rows.length} row${props.rows.length !== 1 ? 's' : ''}`}
      onLinkClick={() => navigate(`#${props.id}`)}
      hasAnchorButton
    >
      <div className={styles.marginTop5}>
        <Table
          headers={props.headers}
          id={props.id}
          rows={props.rows}
          rowsPerPageOptions={[10, 20, 50]}
          rowStyleFn={props.rowStyleFn}
        />
      </div>
    </Card>
  )
}
