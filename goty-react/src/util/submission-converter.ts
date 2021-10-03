import {
  BackendSubmission,
  BackendSubmissionRequest,
  Submission,
} from '../api/submissionService'

export const convertToBackendSubmissionRequest = (
  submission: Submission
): BackendSubmissionRequest => ({
  name: submission.name,
  gamesOfTheYear: submission.gamesOfTheYear.map((game, i) => ({
    ...game,
    rank: i,
  })),
  mostAnticipated: submission.mostAnticipated,
  bestOldGame: submission.bestOldGame,
  enteredGiveaway: submission.enteredGiveaway,
})

export const convertFromBackendToSubmission = (
  backendSubmission: BackendSubmission
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
