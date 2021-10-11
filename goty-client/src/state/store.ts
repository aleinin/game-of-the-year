import { combineReducers, createStore, Store } from '@reduxjs/toolkit'
import { Constants, constantsReducer } from './constants/reducer'
import { resultsReducer, ResultsState } from './results/reducer'
import { submissionReducer, SubmissionState } from './submission/reducer'

export type AppState = {
  constants: Constants
  submission: SubmissionState
  results: ResultsState
}

const rootReducer = combineReducers<AppState>({
  constants: constantsReducer,
  submission: submissionReducer,
  results: resultsReducer,
})

export const configureStore = (): Store<AppState> => {
  const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
  return store
}
