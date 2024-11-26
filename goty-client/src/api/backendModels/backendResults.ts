import { GameOfTheYearResult } from '../../models/gameOfTheYearResult'
import { GameResult } from '../../models/gameResult'
import { Results } from '../../models/results'

export interface BackendResults {
  year: string
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  mostDisappointing: GameResult[]
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
  mostDisappointing: backendResults.mostDisappointing,
  mostAnticipated: backendResults.mostAnticipated,
  giveawayParticipants: backendResults.giveawayParticipants,
})
