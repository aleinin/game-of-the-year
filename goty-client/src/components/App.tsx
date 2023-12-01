import { Header } from './Header'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Recovery } from './Recovery'
import { Provider, useStore } from 'react-redux'
import { configureStore } from '../state/store'
import { SubmissionHub } from './submission/SubmissionHub'
import React, { useEffect } from 'react'
import { Loading } from './Loading'
import { createSetValidatorFunctionAction } from '../state/submission/actions'
import { isValid } from '../state/submission/reducer'
import { Footer } from './Footer'
import styles from './App.module.scss'
import { Responses } from './results/Responses'
import { ResultsPage } from './results/ResultsPage'
import { Summary } from './results/Summary/Summary'
import { Response } from './results/Response'
import { useProperties } from '../api/useProperties'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const App = () => {
  const store = configureStore()
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppRoot />
      </Provider>
    </QueryClientProvider>
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
        children: [
          {
            path: ':page',
            element: <Response />,
          },
        ],
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
  const { properties, isLoading } = useProperties()
  const store = useStore()
  useEffect(() => {
    if (!properties.hasGiveaway) {
      store.dispatch(createSetValidatorFunctionAction(isValid))
    }
  }, [properties, store])
  if (isLoading) {
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
