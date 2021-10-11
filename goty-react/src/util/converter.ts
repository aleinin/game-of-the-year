import { BackendResults, Results } from '../api/resultsService'
import {
  BackendSubmission,
  BackendSubmissionRequest,
  Submission,
} from '../api/submissionService'

export const Converter = {
  convertToBackendSubmissionRequest: (
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
  }),
  convertFromBackendToSubmission: (
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
  }),
  convertFromBackendResultsToResults: (
    backendResults: BackendResults
  ): Results => ({
    participants: backendResults.participants,
    gamesOfTheYear: backendResults.gamesOfTheYear,
    bestOldGames: backendResults.bestOldGame,
    mostAnticipated: backendResults.mostAnticipated,
    giveawayParticipants: backendResults.giveawayParticipants,
  }),
}
