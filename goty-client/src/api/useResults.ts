import { useQuery } from '@tanstack/react-query'
import { Results } from '../models/results'
import fetcher from './fetcher'
import {
  BackendResults,
  fromBackendResultsToResults,
} from './backendModels/backendResults'

const getResults = (year: string): Promise<Results> =>
  fetcher
    .get<BackendResults>(`/results/${year}`)
    .then(fromBackendResultsToResults)

const initialResults = {
  year: new Date().getFullYear().toString(),
  participants: [],
  gamesOfTheYear: [],
  mostAnticipated: [],
  mostDisappointing: [],
  bestOldGames: [],
  giveawayParticipants: [],
}

const oneMinuteMs = 60000

export const useResults = (year: string) => {
  const query = useQuery({
    queryKey: ['results', year],
    queryFn: () => getResults(year),
    initialData: initialResults,
    staleTime: oneMinuteMs,
    initialDataUpdatedAt: 0,
  })
  return { ...query, results: query.data }
}
