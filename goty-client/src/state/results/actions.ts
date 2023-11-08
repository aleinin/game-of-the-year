import { Results } from '../../api/resultsService'
import { Submission } from '../../models/Submission'

export const SET_RESULTS = 'SET_RESULTS'
export const SET_SUBMISSIONS = 'SET_SUBMISSIONS'
export const SET_LOADING = 'SET_LOADING'

export const createSetResultsAction = (results: Results) => ({
  type: SET_RESULTS,
  payload: results,
})

export const createSetSubmissionsAction = (submissions: Submission[]) => ({
  type: SET_SUBMISSIONS,
  payload: submissions,
})

export const createSetLoadingAction = () => ({ type: SET_LOADING })

export type ResultsAction =
  | { type: typeof SET_RESULTS; payload: Results }
  | { type: typeof SET_SUBMISSIONS; payload: Submission[] }
  | { type: typeof SET_LOADING }
