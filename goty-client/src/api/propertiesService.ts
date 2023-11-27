import { Properties } from '../models/properties'
import fetcher from './fetcher'
import {
  BackendProperties,
  fromBackendPropertiesToProperties,
} from './backendModels/backendProperties'

export const propertiesService = {
  getProperties: (): Promise<Properties> =>
    fetcher
      .get<BackendProperties>(
        `/properties?localTimeZone=${
          Intl.DateTimeFormat().resolvedOptions().timeZone
        }`,
      )
      .then(fromBackendPropertiesToProperties),
}
