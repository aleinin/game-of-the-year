import { dateStringToTwelveHourString } from '../util/time'
import { Properties } from '../models/properties'
import fetcher from './fetcher'

export interface BackendProperties {
  tiePoints: number[]
  gotyYear: number
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
}

const toProperties = ({
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
  isGotyConcluded: new Date(deadline) <= new Date(),
})

export const propertiesService = {
  getProperties: (): Promise<Properties> =>
    fetcher.get<BackendProperties>('/properties').then(toProperties),
}
