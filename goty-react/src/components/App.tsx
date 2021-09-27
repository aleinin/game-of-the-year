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
import { SubmissionPage } from "./submission/SubmissionPage"
import { End } from "./End"
import { Recovery } from "./Recovery"
import { Results } from "./results/Results"
import { useEffect, useState } from "react"

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

const notNull = (input: string | null | undefined): input is string => {
  return input != null && input !== "undefined" && input !== "null"
}

export const App = () => {
  // const [hasSubmission, setHasSubmission] = useState(false)
  // useEffect(() => {
  //   const submissionUUID = localStorage.getItem("submissionUUID")
  //   setHasSubmission(notNull(submissionUUID))
  // }, [])
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
              year={2021}
              lastTime="TODO"
              closeDate="TODO"
              maxListSize={10}
            />
          </Route>
          <Route path="/end">
            <End closeDate="TODO" />
          </Route>
          <Route path="/recovery">
            <Recovery />
          </Route>
          <Route path="/results">
            <Results
              year={2021}
              lastTime="TODO"
              closeDate="TODO"
              maxListSize={10}
            />
          </Route>
          <Redirect from="*" to="/start" />
        </Switch>
      </Router>
    </AppRoot>
  )
}
