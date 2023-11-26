import { Properties } from '../../models/properties'
import { dateStringToTwelveHourString } from '../../util/time'

interface ResolvedTemplate {
  template: string
  text: string
}

export interface BackendProperties {
  title: ResolvedTemplate
  year: number
  goty: {
    title: ResolvedTemplate
    question: ResolvedTemplate
    rules: ResolvedTemplate[]
  }
  tiePoints: number[]
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
  defaultLocalTimeZone: string
}

export const fromBackendPropertiesToProperties = ({
  title,
  goty,
  tiePoints,
  year,
  deadline,
  hasGiveaway,
  giveawayAmountUSD,
}: BackendProperties): Properties => ({
  title: title.text,
  goty: {
    title: goty.title.text,
    question: goty.question.text,
    rules: goty.rules.map((rule) => rule.text),
  },
  tiePoints,
  year,
  deadline: dateStringToTwelveHourString(deadline),
  hasGiveaway,
  giveawayAmountUSD,
})
