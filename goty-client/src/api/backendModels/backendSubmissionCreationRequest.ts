import { Game } from '../../models/game'
import { Submission } from '../../models/submission'

export interface BackendSubmissionCreationRequest {
  name: string
  gamesOfTheYear: BackendGamesOfTheYear[]
  mostAnticipated: Game | null
  bestOldGame: Game | null
  enteredGiveaway: boolean | null
}

export const fromSubmissionToBackendSubmissionCreationRequest = (
  submission: Submission,
) => ({
  name: submission.name,
  gamesOfTheYear: submission.gamesOfTheYear.map((game, i) => ({
    ...game,
    rank: i,
  })),
  mostAnticipated: submission.mostAnticipated,
  bestOldGame: submission.bestOldGame,
  enteredGiveaway: submission.enteredGiveaway,
})

interface BackendGamesOfTheYear extends BackendGame {
  rank: number
}

interface BackendGame {
  id: string
  title: string
}
