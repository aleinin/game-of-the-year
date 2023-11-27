export interface Properties {
  title: string
  gotyQuestion: {
    title: string
    question: string
    rules: string[]
  }
  tiePoints: number[]
  year: number
  deadline: string
  hasGiveaway: boolean
  giveawayAmountUSD: number
}
