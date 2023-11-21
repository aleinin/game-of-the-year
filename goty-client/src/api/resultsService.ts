import { Results } from '../models/results'
import fetcher from './fetcher'
import {
  BackendResults,
  fromBackendResultsToResults,
} from './backendModels/backendResults'

export const ResultsService = {
  getResults: (): Promise<Results> => {
    return fetcher
      .get<BackendResults>('/results')
      .then(fromBackendResultsToResults)
  },
}
