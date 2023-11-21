import { Properties } from '../models/properties'
import fetcher from './fetcher'
import {
  BackendProperties,
  fromBackendPropertiesToProperties,
} from './backendModels/backendProperties'

export const propertiesService = {
  getProperties: (): Promise<Properties> =>
    fetcher
      .get<BackendProperties>('/properties')
      .then(fromBackendPropertiesToProperties),
}
