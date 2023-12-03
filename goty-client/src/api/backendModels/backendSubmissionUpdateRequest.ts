import { BackendSubmissionCreationRequest } from './backendSubmissionCreationRequest'
import { Submission } from '../../models/submission'
import { localStorageService } from '../localStorageService'

export interface BackendSubmissionUpdateRequest
  extends BackendSubmissionCreationRequest {
  secret: string
}

export const fromSubmissionToBackendSubmissionUpdateRequest = (
  submission: Submission,
): BackendSubmissionUpdateRequest => ({
  name: submission.name,
  secret: localStorageService.getSubmissionIds().secret,
  gamesOfTheYear: submission.gamesOfTheYear.map((game, i) => ({
    ...game,
    rank: i,
  })),
  mostAnticipated: submission.mostAnticipated,
  mostDisappointing: submission.mostDisappointing,
  bestOldGame: submission.bestOldGame,
  enteredGiveaway: submission.enteredGiveaway,
})
