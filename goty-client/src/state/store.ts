import { combineReducers, createStore, Store } from '@reduxjs/toolkit'
import { propertiesReducer } from './properties/reducer'
import { resultsReducer, ResultsState } from './results/reducer'
import { submissionReducer, SubmissionState } from './submission/reducer'
import { Properties } from '../models/properties'

export type AppState = {
  properties: Properties
  submission: SubmissionState
  results: ResultsState
}

const rootReducer = combineReducers<AppState>({
  properties: propertiesReducer,
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
