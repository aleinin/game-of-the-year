import styled from 'styled-components'
import { Card } from '../Card'
import { Table } from '../controls/Table/Table'
import { Header } from '../controls/Table/Table.types'

export interface ResultsTableProps<T> {
  id: string
  headers: Header<T>[]
  title: string
  rows: T[]
  rowStyleFn?: (row: T) => string
}

const TableContainer = styled.div`
  margin-top: 10px;
`
export const ResultsTable = <T,>(props: ResultsTableProps<T>) => (
  <Card
    title={props.title}
    subtitle={`${props.rows.length} row${props.rows.length !== 1 ? 's' : ''}`}
  >
    <TableContainer>
      <Table
        headers={props.headers}
        id={props.id}
        rows={props.rows}
        rowsPerPageOptions={[10, 20, 50]}
        rowStyleFn={props.rowStyleFn}
      />
    </TableContainer>
  </Card>
)
