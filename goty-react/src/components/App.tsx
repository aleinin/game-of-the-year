import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/mdc-dark-deeppurple/theme.css'
import { Header } from './Header'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Start } from './Start'
import { SubmissionForm } from './submission/SubmissionForm'
import { End } from './End'
import { Recovery } from './Recovery'
import { ResultsComponent } from './results/Results'
import { useEffect, useState } from 'react'
import { Submission } from '../models/submission'
import { SubmissionService } from '../api/submissionService'
import { Provider } from 'react-redux'
import { configureStore } from '../state/store'

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

const notNull = (input: string | null | undefined): input is string => {
  return input != null && input !== 'undefined' && input !== 'null'
}

export enum SubmissionStep {
  Start,
  Form,
  End,
}

export const App = () => {
  const store = configureStore()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [submissionStep, setSubmissionStep] = useState<SubmissionStep>(
    SubmissionStep.Start
  )
  const [submissionError, setSubmissionError] = useState<any>(null)
  useEffect(() => {
    const submissionUUID = localStorage.getItem('submissionUUID')
    if (notNull(submissionUUID)) {
      SubmissionService.getSubmission(submissionUUID).then((submission) => {
        setSubmission(submission)
      })
    }
  }, [])
  const setNextStep = (error?: any) => {
    switch (submissionStep) {
      case SubmissionStep.Start:
        // todo
        setSubmissionStep(SubmissionStep.Form)
        break
      case SubmissionStep.Form:
        if (error != null) {
          setSubmissionError(submissionError)
        }
        setSubmissionStep(SubmissionStep.End)
        break
      case SubmissionStep.End:
        setSubmissionStep(SubmissionStep.Start)
        break
    }
  }
  const getSubmissionStep = () => {
    switch (submissionStep) {
      case SubmissionStep.Start:
        return (
          <Start hasSubmission={submission != null} setNextStep={setNextStep} />
        )
      case SubmissionStep.Form:
        return (
          <SubmissionForm submission={submission} setNextStep={setNextStep} />
        )
      case SubmissionStep.End:
        return <End error={submissionError} setNextStep={setNextStep} />
    }
  }
  return (
    <Provider store={store}>
      <AppRoot>
        <Header />
        <Router>
          <Switch>
            <Route path="/submission">{getSubmissionStep()}</Route>
            <Route path="/recovery">
              <Recovery />
            </Route>
            <Route path="/results">
              <ResultsComponent />
            </Route>
            <Redirect from="*" to="/submission" />
          </Switch>
        </Router>
      </AppRoot>
    </Provider>
  )
}
