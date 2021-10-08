import { Store } from 'redux'
import { ResultsService } from '../../api/resultsService'
import { SubmissionService } from '../../api/submissionService'
import {
  createSetLoadingAction,
  createSetResultsAction,
  createSetSubmissionsAction,
} from './actions'

let resultsLoaded = false
let submissionsLoaded = false

export const loadResults = ({ dispatch }: Store) => {
  if (!resultsLoaded) {
    dispatch(createSetLoadingAction())
    ResultsService.getResults().then((results) => {
      resultsLoaded = true
      dispatch(createSetResultsAction(results))
    })
  }
}

export const loadResultsAndSubmissions = ({ dispatch }: Store) => {
  if (!resultsLoaded && !submissionsLoaded) {
    dispatch(createSetLoadingAction())
    Promise.all([
      ResultsService.getResults(),
      SubmissionService.getSubmissions(),
    ]).then(([results, submissions]) => {
      resultsLoaded = true
      submissionsLoaded = true
      dispatch(createSetResultsAction(results))
      dispatch(createSetSubmissionsAction(submissions))
    })
  } else if (!submissionsLoaded) {
    dispatch(createSetLoadingAction())
    SubmissionService.getSubmissions().then((submissions) => {
      submissionsLoaded = true
      dispatch(createSetSubmissionsAction(submissions))
    })
  }
}
