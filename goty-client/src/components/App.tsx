import { Header } from './Header'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Recovery } from './Recovery'
import { ResultsComponent } from './results/Results'
import { Provider, useStore } from 'react-redux'
import { configureStore } from '../state/store'
import { SubmissionHub } from './submission/SubmissionHub'
import React, { useEffect, useState } from 'react'
import { Loading } from './Loading'
import { createSetPropertiesAction } from '../state/properties/actions'
import { createSetValidatorFunctionAction } from '../state/submission/actions'
import { isValid } from '../state/submission/reducer'
import { propertiesService } from '../api/propertiesService'
import { Footer } from './Footer'
import { ResultsContainer } from './results/ResultsContainer'
import { Submissions } from './results/Submissions'
import styles from './App.module.scss'

export const App = () => {
  const store = configureStore()
  return (
    <Provider store={store}>
      <AppRoot />
    </Provider>
  )
}

const router = createBrowserRouter([
  {
    path: '/submission',
    element: <SubmissionHub />,
  },
  {
    path: '/recovery',
    element: <Recovery />,
  },
  {
    path: '/results',
    element: <ResultsComponent />,
    children: [
      {
        path: 'summary',
        element: <ResultsContainer />,
      },
      {
        path: 'responses',
        element: <Submissions />,
      },
      {
        path: '',
        element: <Navigate to="summary" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/submission" replace />,
  },
])

const AppRoot = () => {
  const [appReady, setAppReady] = useState(false)
  const store = useStore()
  useEffect(() => {
    propertiesService.getProperties().then((properties) => {
      store.dispatch(createSetPropertiesAction(properties))
      if (!properties.hasGiveaway) {
        store.dispatch(createSetValidatorFunctionAction(isValid))
      }
      setAppReady(true)
    })
  }, [store])
  if (!appReady) {
    return <Loading></Loading>
  }
  return (
    <div className={styles.page}>
      <div className={styles.root}>
        <Header />
        <RouterProvider router={router} />
      </div>
      <Footer></Footer>
    </div>
  )
}
