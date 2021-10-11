import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/md-dark-deeppurple/theme.css'
import { Header } from './Header'
import styled from 'styled-components'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Recovery } from './Recovery'
import { ResultsComponent } from './results/Results'
import { Provider, useStore } from 'react-redux'
import { configureStore } from '../state/store'
import { SubmissionHub } from './submission/SubmissionHub'
import React, { useEffect, useState } from 'react'
import { configService } from '../api/configService'
import { Loading } from './Loading'
import { createSetConstantsAction } from '../state/constants/actions'
import axios from 'axios'
import { createSetValidatorFunctionAction } from '../state/submission/actions'
import { isValid } from '../state/submission/reducer'

export const App = () => {
  const store = configureStore()
  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  )
}

const AppRootStyle = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`

const AppRoot = () => {
  const [appReady, setAppReady] = useState(false)
  const store = useStore()
  useEffect(() => {
    configService.getConfig().then((constants) => {
      axios.defaults.baseURL = constants.baseUrl ?? 'http://localhost:8080'
      if (axios.defaults.headers) {
        ;(axios.defaults.headers.common as any)['Accept'] = 'application/json'
        ;(axios.defaults.headers.post as any)['Content-Type'] =
          'application/json'
      }
      store.dispatch(createSetConstantsAction(constants))
      if (constants.hasGiveaway === false) {
        store.dispatch(createSetValidatorFunctionAction(isValid))
      }
      setAppReady(true)
    })
  }, [store])
  if (!appReady) {
    return <Loading></Loading>
  }
  return (
    <AppRootStyle>
      <Header />
      <Router>
        <Switch>
          <Route path="/submission">
            <SubmissionHub />
          </Route>
          <Route path="/recovery">
            <Recovery />
          </Route>
          <Route path="/results">
            <ResultsComponent />
          </Route>
          <Redirect from="*" to="/submission" />
        </Switch>
      </Router>
    </AppRootStyle>
  )
}
