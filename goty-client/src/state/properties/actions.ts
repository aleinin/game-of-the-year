import { Properties } from '../../models/properties'

export const SET_PROPERTIES = 'SET_PROPERTIES'

export const createSetPropertiesAction = (properties: Properties) => ({
  type: SET_PROPERTIES,
  payload: properties,
})

export type PropertiesActions = {
  type: typeof SET_PROPERTIES
  payload: Properties
}
