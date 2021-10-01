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
import { Constants } from '../models/constants'

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

const notNull = (input: string | null | undefined): input is string => {
  return input != null && input !== 'undefined' && input !== 'null'
}

// todo externalize
const constants: Constants = {
  tiePoints: [15, 13, 11, 7, 6, 5, 4, 3, 2, 1],
  year: 2021,
  closeDate: '1/1/2022',
  lastTime: '12/31/2021 11:59PM',
  hasGiveaway: false, // todo implement
  giveawayAmountUSD: 0, // todo implement
  baseUrl: '',
  maxListSize: 10,
  isGotyConcluded: false,
}

export enum SubmissionStep {
  Start,
  Form,
  End,
}

export const App = () => {
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
          <Start
            isGotyConcluded={constants.isGotyConcluded}
            hasSubmission={submission != null}
            year={constants.year}
            setNextStep={setNextStep}
          />
        )
      case SubmissionStep.Form:
        return (
          <SubmissionForm
            year={constants.year}
            lastTime={constants.lastTime}
            closeDate={constants.closeDate}
            maxListSize={constants.maxListSize}
            submission={submission}
            setNextStep={setNextStep}
            tiePoints={constants.tiePoints}
          />
        )
      case SubmissionStep.End:
        return (
          <End
            closeDate={constants.closeDate}
            error={submissionError}
            setNextStep={setNextStep}
          />
        )
    }
  }
  return (
    <AppRoot>
      <Header year={constants.year} />
      <Router>
        <Switch>
          <Route path="/submission">{getSubmissionStep()}</Route>
          <Route path="/recovery">
            <Recovery />
          </Route>
          <Route path="/results">
            <ResultsComponent
              year={constants.year}
              lastTime={constants.lastTime}
              closeDate={constants.closeDate}
              maxListSize={constants.maxListSize}
            />
          </Route>
          <Redirect from="*" to="/submission" />
        </Switch>
      </Router>
    </AppRoot>
  )
}
