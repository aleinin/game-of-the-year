import axios from 'axios'
import { Converter } from '../util/converter'
import { Results } from '../models/results'
import { GameResult } from '../models/gameResult'
import { GameOfTheYearResult } from '../models/gameOfTheYearResult'

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
