import { useQuery } from '@tanstack/react-query'
import { Results } from '../models/results'
import fetcher from './fetcher'
import {
  BackendResults,
  fromBackendResultsToResults,
} from './backendModels/backendResults'

const getResults = (): Promise<Results> =>
  fetcher.get<BackendResults>('/results').then(fromBackendResultsToResults)

const initialResults = {
  participants: [],
  gamesOfTheYear: [],
  mostAnticipated: [],
  bestOldGames: [],
  giveawayParticipants: [],
}

export const useResults = () => {
  const query = useQuery({
    queryKey: ['results'],
    queryFn: getResults,
    initialData: initialResults,
  })
  return { ...query, results: query.data }
}
