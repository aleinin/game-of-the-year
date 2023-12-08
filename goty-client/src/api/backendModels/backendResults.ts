import { GameOfTheYearResult } from '../../models/gameOfTheYearResult'
import { GameResult } from '../../models/gameResult'
import { Results } from '../../models/results'

export interface BackendResults {
  year: number
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGame: GameResult[]
  giveawayParticipants: string[]
}

export const fromBackendResultsToResults = (
  backendResults: BackendResults,
): Results => ({
  year: backendResults.year,
  participants: backendResults.participants,
  gamesOfTheYear: backendResults.gamesOfTheYear,
  bestOldGames: backendResults.bestOldGame,
  mostAnticipated: backendResults.mostAnticipated,
  giveawayParticipants: backendResults.giveawayParticipants,
})
