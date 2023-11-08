import { Results } from '../../api/resultsService'
import {
  ResultsAction,
  SET_LOADING,
  SET_RESULTS,
  SET_SUBMISSIONS,
} from './actions'
import { Submission } from '../../models/Submission'

export interface ResultsState {
  results: Results
  submissions: Submission[]
  isLoading: boolean
}

const initialResults: Results = {
  participants: [],
  gamesOfTheYear: [],
  mostAnticipated: [],
  bestOldGames: [],
  giveawayParticipants: [],
}

const initialState: ResultsState = {
  results: initialResults,
  submissions: [],
  isLoading: false,
}

export const resultsReducer = (
  state = initialState,
  action: ResultsAction
): ResultsState => {
  switch (action.type) {
    case SET_RESULTS:
      return {
        ...state,
        isLoading: false,
        results: action.payload,
      }
    case SET_SUBMISSIONS:
      return {
        ...state,
        isLoading: false,
        submissions: action.payload,
      }
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
      }
    default: {
      return state
    }
  }
}
