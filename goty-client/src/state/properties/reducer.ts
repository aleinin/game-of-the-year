import { PropertiesActions, SET_PROPERTIES } from './actions'
import { Properties } from '../../models/properties'

const currentYear = () => new Date().getFullYear()

const initialState: Properties = {
  gotyQuestion: { question: '', rules: [''], title: '' },
  title: '',
  tiePoints: [],
  year: currentYear(),
  deadline: `1/1/${currentYear() + 1}`,
  hasGiveaway: true,
  giveawayAmountUSD: 0,
}

export const propertiesReducer = (
  state = initialState,
  action: PropertiesActions,
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
