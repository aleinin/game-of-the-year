import styled from 'styled-components'
import { Card } from '../Card'
import { Table } from '../controls/table/Table'
import { Header } from '../controls/table/Table.types'

export interface ResultsTableProps<T> {
  id: string
  headers: Header<T>[]
  title: string
  rows: T[]
}

// const isStringArr = (input: any[]): input is string[] =>
//   input.every((item) => typeof item === 'string')
//
// const capitalizeFirstLetter = (str: string) =>
//   `${str.charAt(0).toUpperCase()}${str.slice(1)}`

const TableContainer = styled.div`
  margin-top: 10px;
`
export const ResultsTable = <T,>(props: ResultsTableProps<T>) => {
  // if (isStringArr(props.rows)) {
  //   values = props.rows.map((row) => ({ value: row }))
  //   columns = [<Column key="value" field="value" />]
  // } else {
  //   values = props.rows.map((row) => ({ ...row, rank: row.rank + 1 }))
  //   columns = props.columnConfig.map((column) => (
  //     <Column
  //       key={column}
  //       header={capitalizeFirstLetter(column)}
  //       field={column}
  //     />
  //   ))
  // }
  return (
    <Card title={props.title} subtitle={`${props.rows.length} rows`}>
      <TableContainer>
        <Table
          headers={props.headers}
          id={props.id}
          rows={props.rows}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>
      {/*<TableContainer>*/}
      {/*  <GotyDataTable*/}
      {/*    value={values}*/}
      {/*    paginator*/}
      {/*    rows={10}*/}
      {/*    rowsPerPageOptions={[10, 20, 50]}*/}
      {/*    rowClassName={props.rowStyle}*/}
      {/*  >*/}
      {/*    {columns}*/}
      {/*  </GotyDataTable>*/}
      {/*</TableContainer>*/}
    </Card>
  )
}
