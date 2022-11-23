import { PropertiesActions, SET_PROPERTIES } from './actions'

export interface Properties {
  tiePoints: number[]
  year: number
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
  maxGamesOfTheYear: number
  isGotyConcluded: boolean
}

const currentYear = () => new Date().getFullYear()

const initialState: Properties = {
  tiePoints: [],
  year: currentYear(),
  deadline: `1/1/${currentYear() + 1}`,
  hasGiveaway: true,
  giveawayAmountUSD: 0,
  maxGamesOfTheYear: 0,
  isGotyConcluded: false,
}

export const propertiesReducer = (
  state = initialState,
  action: PropertiesActions
) => {
  switch (action.type) {
    case SET_PROPERTIES:
      return {
        ...state,
        ...action.payload,
      }
    default: {
      return state
    }
  }
}
