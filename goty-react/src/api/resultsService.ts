import { theResults } from './mockData'

export interface GameOfTheYearResult extends GameResult {
  points: number
}

export interface GameResult {
  id: string
  rank: number
  title: string
  votes: number
}

export interface Results {
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGames: GameResult[]
  giveawayEntries: string[]
}

export type Result = string[] | GameOfTheYearResult[] | GameResult[]

export const ResultsService = {
  getResults: (): Promise<Results> => {
    return new Promise((resolve) => setTimeout(() => resolve(theResults), 250))
  },
}
