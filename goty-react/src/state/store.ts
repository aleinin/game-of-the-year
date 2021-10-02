import { combineReducers, createStore, Store } from '@reduxjs/toolkit'
import { Constants } from '../models/constants'
import { constantsReducer } from './constants/reducer'

export type AppState = {
  constants: Constants
}

const rootReducer = combineReducers<AppState>({
  constants: constantsReducer,
})

export const configureStore = (): Store<AppState> => {
  const store = createStore(rootReducer, undefined)
  return store
}
