import { DataTable, DataTableProps } from 'primereact/datatable'
import styled from 'styled-components'

const StyleContainer = styled.div`
  .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
    background: rgba(103, 58, 183, 0.16);
    border-color: rgba(103, 58, 183, 0.16);
    color: #673ab7;
  }

  .p-datatable .p-datatable-tbody tr.ranked-first {
    background-color: #ffd70099;
    color: black;
  }

  .p-datatable .p-datatable-tbody tr.ranked-second {
    background-color: #6c7a86;
  }

  .p-datatable .p-datatable-tbody tr.ranked-third {
    background-color: #915c1d;
  }

  .p-datatable .p-datatable-tbody tr.ranked-eliminated {
    background-color: #5555555e;
    color: gray;
  }
`

export const GotyDataTable = (
  props: React.PropsWithChildren<DataTableProps<any>>
) => (
  <StyleContainer>
    <DataTable {...props} />
  </StyleContainer>
)
