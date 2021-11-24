import { Constants } from './reducer'

export const SET_CONSTANTS = 'SET_CONSTANTS'

export const createSetConstantsAction = (constants: Partial<Constants>) => ({
  type: SET_CONSTANTS,
  payload: constants,
})

export type ConstantsAction = {
  type: typeof SET_CONSTANTS
  payload: Partial<Constants>
}
