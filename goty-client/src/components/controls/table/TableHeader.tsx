import { Header } from './Table.types'
import styled from 'styled-components'

const ThStyle = styled.th`
  text-align: left;
`
const TrHeaderStyle = styled.tr``

export interface TableHeaderProps<T> {
  headers: Header<T>[]
}

export const TableHeader = <T,>({ headers }: TableHeaderProps<T>) => (
  <thead>
    <TrHeaderStyle>
      {headers.map((header) => (
        <ThStyle key={header.key}>{header.label}</ThStyle>
      ))}
    </TrHeaderStyle>
  </thead>
)
