import styled from 'styled-components'
import { Card } from '../Card'
import { Column } from 'primereact/column'
import { Result } from '../../api/resultsService'
import { GotyDataTable } from '../styled-controls/GotyDataTable'

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
  let values: any[]
  let columns: JSX.Element[]
  if (isStringArr(props.rows)) {
    values = props.rows.map((row) => ({ value: row }))
    columns = [<Column key="value" field="value" />]
  } else {
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
    <Card title={props.title} subtitle={`${props.rows.length} rows`}>
      <TableContainer>
        <GotyDataTable
          value={values}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          rowClassName={props.rowStyle}
        >
          {columns}
        </GotyDataTable>
      </TableContainer>
    </Card>
  )
}
