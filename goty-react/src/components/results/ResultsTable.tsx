import styled from 'styled-components'
import { Card } from '../Card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import React from 'react'

export interface ResultsTableProps {
  title: string
  rows: any[]
  columnConfig?: string[] // todo
}

const TableContainer = styled.div`
  margin-top: 10px;
`

export const ResultsTable = (props: ResultsTableProps) => {
  const columns = props.columnConfig ? (
    <React.Fragment>
      {props.columnConfig.map((column) => (
        <Column field={column} header={column} />
      ))}
    </React.Fragment>
  ) : null
  return (
    <Card
      title={props.title}
      subtitle={`${props.rows.length} rows`}
      content={
        <TableContainer>
          <DataTable
            value={props.rows}
            autoLayout
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
          >
            {columns}
          </DataTable>
        </TableContainer>
      }
    />
  )
}
