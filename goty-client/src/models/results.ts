import { GameResult } from './gameResult'
import { GameOfTheYearResult } from './gameOfTheYearResult'

export interface Results {
  year: number
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  mostDisappointing: GameResult[]
  bestOldGames: GameResult[]
  giveawayParticipants: string[]
}
