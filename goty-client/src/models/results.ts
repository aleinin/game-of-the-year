import { GameResult } from './gameResult'
import { GameOfTheYearResult } from './gameOfTheYearResult'

export interface Results {
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGames: GameResult[]
  giveawayParticipants: string[]
}