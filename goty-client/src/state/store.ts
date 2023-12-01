import { combineReducers, createStore, Store } from '@reduxjs/toolkit'
import { submissionReducer, SubmissionState } from './submission/reducer'

export type AppState = {
  submission: SubmissionState
}

const rootReducer = combineReducers<AppState>({
  submission: submissionReducer,
})

export const configureStore = (): Store<AppState> =>
  createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  )
