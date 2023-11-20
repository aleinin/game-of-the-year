import { Properties } from '../../models/properties'
import { dateStringToTwelveHourString } from '../../util/time'

export interface BackendProperties {
  tiePoints: number[]
  gotyYear: number
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
}

export const fromBackendPropertiesToProperties = ({
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
