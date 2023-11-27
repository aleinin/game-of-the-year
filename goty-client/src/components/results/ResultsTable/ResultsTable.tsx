import { Card } from '../../controls/Card/Card'
import { Table } from '../../controls/Table/Table'
import { Header } from '../../controls/Table/Table.types'
import styles from './ResultsTable.module.scss'

export interface ResultsTableProps<T> {
  id: string
  headers: Header<T>[]
  title: string
  rows: T[]
  rowStyleFn?: (row: T) => string
}

export const ResultsTable = <T,>(props: ResultsTableProps<T>) => (
  <Card
    title={props.title}
    index={`${props.rows.length} row${props.rows.length !== 1 ? 's' : ''}`}
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
