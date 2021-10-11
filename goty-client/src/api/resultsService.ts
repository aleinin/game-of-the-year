import axios from 'axios'
import { Converter } from '../util/converter'

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
  giveawayParticipants: string[]
}

export interface BackendResults {
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGame: GameResult[]
  giveawayParticipants: string[]
}

export type Result = string[] | GameOfTheYearResult[] | GameResult[]

export const ResultsService = {
  getResults: (): Promise<Results> => {
    return axios
      .get<BackendResults>('/results')
      .then((response) =>
        Converter.convertFromBackendResultsToResults(response.data)
      )
  },
}
