import { BackendSubmissionCreationRequest } from './backendSubmissionCreationRequest'
import { Submission } from '../../models/submission'

export interface BackendSubmission extends BackendSubmissionCreationRequest {
  id: string
  year: number
}

export const fromBackendSubmissionToSubmission = (
  backendSubmission: BackendSubmission,
): Submission => ({
  submissionUUID: backendSubmission.id,
  name: backendSubmission.name,
  gamesOfTheYear: backendSubmission.gamesOfTheYear.map((game) => ({
    title: game.title,
    id: game.id,
  })),
  mostAnticipated: backendSubmission.mostAnticipated,
  bestOldGame: backendSubmission.bestOldGame,
  enteredGiveaway: backendSubmission.enteredGiveaway,
})
