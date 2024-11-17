import { useQuery } from '@tanstack/react-query'
import fetcher from './fetcher'
import {
  BackendProperties,
  fromBackendPropertiesToProperties,
} from './backendModels/backendProperties'
import { Properties } from '../models/properties'

const getProperties = (year?: number) => {
  const url = year ? `/properties/${year}` : '/properties/active'
  return fetcher
    .get<BackendProperties>(
      `${url}?localTimeZone=${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`,
    )
    .then(fromBackendPropertiesToProperties)
}

const initialProperties: Properties = {
  gotyQuestion: { question: '', rules: [''], title: '' },
  title: '',
  tiePoints: [],
  year: new Date().getFullYear(),
  deadline: `1/1/${new Date().getFullYear() + 1}`,
  hasGiveaway: true,
  giveawayAmountUSD: 0,
}

const oneMinuteMs = 60000

export const useProperties = (year?: number) => {
  console.log('year', year)
  const query = useQuery({
    queryKey: ['properties', year],
    queryFn: () => getProperties(year),
    initialData: initialProperties,
    staleTime: oneMinuteMs,
    initialDataUpdatedAt: 0,
  })
  return { ...query, properties: query.data }
}
