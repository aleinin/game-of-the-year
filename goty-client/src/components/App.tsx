import { Header } from './Header'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Recovery } from './Recovery'
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
import styles from './App.module.scss'
import { Responses } from './results/Responses/Responses'
import { ResultsPage } from './results/ResultsPage'
import { Summary } from './results/Summary/Summary'

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
    element: <ResultsPage />,
    children: [
      {
        path: 'summary',
        element: <Summary />,
      },
      {
        path: 'responses',
        element: <Responses />,
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
