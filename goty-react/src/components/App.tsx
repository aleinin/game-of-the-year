import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primereact/resources/themes/mdc-dark-deeppurple/theme.css"
import { Header } from "./Header"
import styled from "styled-components"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { Start } from "./Start"
import { SubmissionPage } from "./submission/Submission"

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

export const App = () => {
  return (
    <AppRoot>
      <Header year={2021} />
      <Router>
        <Switch>
          <Route path="/start">
            <Start isGotyConcluded={false} hasSubmission={false} year={2021} />
          </Route>
          <Route path="/submission">
            <SubmissionPage
              readonly={false}
              year={2021}
              lastTime="TODO"
              closeDate="TODO"
              maxListSize={10}
            />
          </Route>
          <Route path="/end">
            <h1>TODO END</h1>
          </Route>
          <Route path="/recovery">
            <h1>TODO RECOVERY</h1>
          </Route>
          <Route path="/results">
            <h1>TODO RESULTS</h1>
          </Route>
          <Redirect from="*" to="/start" />
        </Switch>
      </Router>
    </AppRoot>
  )
}
