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
import { Provider } from 'react-redux'
import { configureStore } from '../state/store'
import { SubmissionHub } from './submission/SubmissionHub'

const AppRoot = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`
export const App = () => {
  const store = configureStore()
  return (
    <Provider store={store}>
      <AppRoot>
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
      </AppRoot>
    </Provider>
  )
}
