import { combineReducers, createStore, Store } from '@reduxjs/toolkit'
import { resultsReducer, ResultsState } from './results/reducer'
import { submissionReducer, SubmissionState } from './submission/reducer'

export type AppState = {
  submission: SubmissionState
  results: ResultsState
}

const rootReducer = combineReducers<AppState>({
  submission: submissionReducer,
  results: resultsReducer,
})

export const configureStore = (): Store<AppState> =>
  createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  )
