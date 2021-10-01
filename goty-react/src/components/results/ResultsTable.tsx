import styled from 'styled-components'
import { Card } from '../Card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Result } from '../../models/results'

export interface ResultsTableProps {
  title: string
  rows: Result
  columnConfig: string[]
  rowStyle: (data: any) => object
}

const isStringArr = (input: any[]): input is string[] =>
  input.every((item) => typeof item === 'string')

const capitalizeFirstLetter = (str: string) =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`

const TableContainer = styled.div`
  margin-top: 10px;
`
export const ResultsTable = (props: ResultsTableProps) => {
  let isStrings: boolean
  let values: any[]
  let columnConfig: string[]
  let columns: JSX.Element[]
  if (isStringArr(props.rows)) {
    isStrings = true
    columnConfig = ['value']
    values = props.rows.map((row) => ({ value: row }))
    columns = [<Column field="value" />]
  } else {
    isStrings = false
    columnConfig = props.columnConfig
    values = props.rows.map((row) => ({ ...row, rank: row.rank + 1 }))
    columns = props.columnConfig.map((column) => (
      <Column
        key={column}
        header={capitalizeFirstLetter(column)}
        field={column}
      />
    ))
  }
  return (
    <Card
      title={props.title}
      subtitle={`${props.rows.length} rows`}
      content={
        <TableContainer>
          <DataTable
            value={values}
            autoLayout
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            rowClassName={props.rowStyle}
          >
            {columns}
          </DataTable>
        </TableContainer>
      }
    />
  )
}
