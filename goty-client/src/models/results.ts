import { GameResult } from './gameResult'
import { GameOfTheYearResult } from './gameOfTheYearResult'

export interface Results {
  year: string
  participants: string[]
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  mostDisappointing: GameResult[]
  bestOldGames: GameResult[]
  giveawayParticipants: string[]
}
