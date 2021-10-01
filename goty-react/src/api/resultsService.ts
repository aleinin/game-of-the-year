import { Results } from '../models/results'
import { theResults } from './mockData'

export const ResultsService = {
  getResults: (): Promise<Results> => {
    return new Promise((resolve) => setTimeout(() => resolve(theResults), 250))
  },
}
