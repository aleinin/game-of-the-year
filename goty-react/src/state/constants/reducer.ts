import { ConstantsAction, SET_CONSTANTS } from './actions'

export interface Constants {
  tiePoints: number[]
  year: number
  closeDate: string
  lastTime: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
  baseUrl: string
  maxListSize: number
  isGotyConcluded: boolean
}

const currentYear = () => new Date().getFullYear()

const initialState: Constants = {
  tiePoints: [15, 13, 11, 7, 6, 5, 4, 3, 2, 1],
  year: currentYear(),
  closeDate: `1/1/${currentYear() + 1}`,
  lastTime: `12/31/${currentYear()} 11:59PM`,
  hasGiveaway: false, // todo #30
  giveawayAmountUSD: 0, // todo #30
  baseUrl: '',
  maxListSize: 10,
  isGotyConcluded: false,
}

export const constantsReducer = (
  state = initialState,
  action: ConstantsAction
) => {
  switch (action.type) {
    case SET_CONSTANTS:
      return {
        ...state,
        ...action.payload,
      }
    default: {
      return state
    }
  }
}
