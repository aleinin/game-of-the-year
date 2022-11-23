import axios from 'axios'
import { Properties } from '../state/properties/reducer'

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
  deadline: formatDateString(deadline),
  hasGiveaway,
  giveawayAmountUSD,
  maxGamesOfTheYear: tiePoints.length,
  isGotyConcluded: false, // todo
})

const formatDateString = (dateString: string) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const time = toTwelveHour(date.getHours(), date.getMinutes())
  return `${month}/${day}/${year} ${time}`
}

const toTwelveHour = (twentyFourHours: number, minutesNum: number) => {
  const minutes = minutesNum < 10 ? `0${minutesNum}` : `${minutesNum}`
  let hours
  let period: 'AM' | 'PM'
  if (twentyFourHours > 12) {
    period = 'PM'
    hours = twentyFourHours - 12
  } else {
    period = 'AM'
    hours = twentyFourHours
  }
  return `${hours}:${minutes}${period}`
}

export const propertiesService = {
  getProperties: (): Promise<Properties> => {
    return axios.get<BackendProperties>('/properties').then((axiosResponse) => {
      console.log(axiosResponse.data)
      return toBackendPropertiesToProperties(axiosResponse.data)
    })
  },
}
