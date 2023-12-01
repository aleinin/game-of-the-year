import { Header } from './Header'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Recovery } from './Recovery'
import { SubmissionRouter } from './submission/SubmissionRouter'
import React from 'react'
import { Loading } from './Loading'
import { Footer } from './Footer'
import styles from './App.module.scss'
import { Responses } from './results/Responses'
import { ResultsPage } from './results/ResultsPage'
import { Summary } from './results/Summary/Summary'
import { Response } from './results/Response'
import { useProperties } from '../api/useProperties'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const App = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoot />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/submission',
    element: <SubmissionRouter />,
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
  const { isLoading } = useProperties()
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
