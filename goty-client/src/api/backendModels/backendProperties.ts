import { Properties } from '../../models/properties'
import { dateStringToTwelveHourString } from '../../util/time'

interface ResolvedTemplate {
  template: string
  text: string
}

export interface BackendProperties {
  title: ResolvedTemplate
  year: number
  gotyQuestion: {
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
  gotyQuestion,
  tiePoints,
  year,
  deadline,
  hasGiveaway,
  giveawayAmountUSD,
}: BackendProperties): Properties => ({
  title: title.text,
  gotyQuestion: {
    title: gotyQuestion.title.text,
    question: gotyQuestion.question.text,
    rules: gotyQuestion.rules.map((rule) => rule.text),
  },
  tiePoints,
  year,
  deadline: dateStringToTwelveHourString(deadline),
  hasGiveaway,
  giveawayAmountUSD,
})
