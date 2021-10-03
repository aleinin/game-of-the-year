import { Constants } from './reducer'

export const SET_CONSTANTS = 'SET_CONSTANTS'

export const setConstants = (constants: Partial<Constants>) => ({
  type: SET_CONSTANTS,
  payload: constants,
})

export type Actions = ReturnType<typeof setConstants>
