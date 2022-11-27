import axios from 'axios'
import { Properties } from '../state/properties/reducer'
import { dateStringToTwelveHourString } from '../util/time'

export interface BackendProperties {
  tiePoints: number[]
  gotyYear: number
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
}

const toBackendPropertiesToProperties = ({
  tiePoints,
  gotyYear,
  deadline,
  hasGiveaway,
  giveawayAmountUSD,
}: BackendProperties): Properties => ({
  tiePoints,
  year: gotyYear,
  deadline: dateStringToTwelveHourString(deadline),
  hasGiveaway,
  giveawayAmountUSD,
  maxGamesOfTheYear: tiePoints.length,
  isGotyConcluded: false, // todo
})

export const propertiesService = {
  getProperties: (): Promise<Properties> => {
    return axios.get<BackendProperties>('/properties').then((axiosResponse) => {
      console.log(axiosResponse.data)
      return toBackendPropertiesToProperties(axiosResponse.data)
    })
  },
}
