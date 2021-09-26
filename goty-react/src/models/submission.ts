import { Game } from "./game"

export interface Submission {
  name: string
  gamesOfTheYear: Game[]
  bestOldGame: Game | null
  mostAnticipated: Game | null
  enteredGiveaway: boolean | null
}
