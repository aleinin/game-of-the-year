import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import { Title } from "./Title"
import styled from "styled-components"

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

export const App = () => {
  return (
    <AppRoot>
      <Title year={2021}></Title>
    </AppRoot>
  )
}
