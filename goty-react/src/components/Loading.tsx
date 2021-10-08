import { ProgressSpinner } from 'primereact/progressspinner'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
`

export const Loading = () => (
  <LoadingContainer>
    <ProgressSpinner />
  </LoadingContainer>
)
