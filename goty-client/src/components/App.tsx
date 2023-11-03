import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/md-dark-deeppurple/theme.css'
import { Header } from './Header'
import styled from 'styled-components'
import {
  Navigate, createBrowserRouter, RouterProvider,
} from 'react-router-dom'
import { Recovery } from './Recovery'
import { ResultsComponent } from './results/Results'
import { Provider, useStore } from 'react-redux'
import { configureStore } from '../state/store'
import { SubmissionHub } from './submission/SubmissionHub'
import React, { useEffect, useState } from 'react'
import { Loading } from './Loading'
import { createSetPropertiesAction } from '../state/properties/actions'
import axios from 'axios'
import { createSetValidatorFunctionAction } from '../state/submission/actions'
import { isValid } from '../state/submission/reducer'
import { propertiesService } from '../api/propertiesService'
import { baseUrlService } from '../api/baseUrlService'
import { Footer } from './Footer'
import {ResultsContainer} from './results/ResultsContainer'
import {Submissions} from './results/Submissions'

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
  flex: 1;
`

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`

const router = createBrowserRouter([
  {
    path: '/submission',
    element: <SubmissionHub />
  },
  {
    path: '/recovery',
    element: <Recovery />
  },
  {
    path: '/results',
    element: <ResultsComponent />,
    children: [
      {
        path: 'summary',
        element: <ResultsContainer />
      },
      {
        path: 'responses',
        element: <Submissions />
      },
      {
        path: '',
        element: <Navigate to="summary" replace />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/submission" replace />
  }
])

const AppRoot = () => {
  const [appReady, setAppReady] = useState(false)
  const store = useStore()
  useEffect(() => {
    baseUrlService.getBaseUrl().then((baseUrl) => {
      axios.defaults.baseURL = baseUrl ?? 'http://localhost:8080'
      if (axios.defaults.headers) {
        ;(axios.defaults.headers.common as any)['Accept'] = 'application/json'
        ;(axios.defaults.headers.post as any)['Content-Type'] =
          'application/json'
      }
      propertiesService.getProperties().then((properties) => {
        store.dispatch(createSetPropertiesAction(properties))
        if (!properties.hasGiveaway) {
          store.dispatch(createSetValidatorFunctionAction(isValid))
        }
        setAppReady(true)
      })
    })
  }, [store])
  if (!appReady) {
    return <Loading></Loading>
  }
  return (
    <Page>
      <AppRootStyle>
        <Header />
        <RouterProvider router={router} />
      </AppRootStyle>
      <Footer></Footer>
    </Page>
  )
}
