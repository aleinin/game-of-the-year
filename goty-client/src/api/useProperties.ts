import { useQuery } from '@tanstack/react-query'
import fetcher from './fetcher'
import {
  BackendProperties,
  fromBackendPropertiesToProperties,
} from './backendModels/backendProperties'
import { Properties } from '../models/properties'

const getProperties = () =>
  fetcher
    .get<BackendProperties>(
      `/properties?localTimeZone=${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`,
    )
    .then(fromBackendPropertiesToProperties)

const iniitalProperties: Properties = {
  gotyQuestion: { question: '', rules: [''], title: '' },
  title: '',
  tiePoints: [],
  year: new Date().getFullYear(),
  deadline: `1/1/${new Date().getFullYear() + 1}`,
  hasGiveaway: true,
  giveawayAmountUSD: 0,
}
export const useProperties = () => {
  const query = useQuery({
    queryKey: ['properties'],
    queryFn: getProperties,
    initialData: iniitalProperties,
  })
  return { ...query, properties: query.data }
}
