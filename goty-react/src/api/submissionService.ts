import { Game } from './gameService'
import { allSubmissions, theSubmission } from './mockData'

export interface Submission {
  submissionUUID: string
  name: string
  gamesOfTheYear: Game[]
  bestOldGame: Game | null
  mostAnticipated: Game | null
  enteredGiveaway: boolean | null
}

export interface BackendSubmission extends BackendSubmissionRequest {
  id: string
}

interface BackendGamesOfTheYear extends Game {
  rank: number
}

export interface BackendSubmissionRequest {
  name: string
  gamesOfTheYear: BackendGamesOfTheYear[]
  mostAnticipated: Game | null
  bestOldGame: Game | null
  enteredGiveaway: boolean | null
}

export const SubmissionService = {
  getSubmission: (submissionUUID: string): Promise<Submission> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(theSubmission), 250)
    )
  },
  getSubmissions: (): Promise<Submission[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(allSubmissions), 250)
    )
  },
  createSubmission: (submission: Submission): Promise<Submission> => {
    const fakeUUID = '6f72220e-fed0-4add-9756-690b882c03d0'
    const fakeReturn: Submission = {
      ...submission,
      submissionUUID: fakeUUID,
    }
    return new Promise((resolve) => setTimeout(() => resolve(fakeReturn), 250))
  },
  // todo return type
  updateSubmission: (submission: Submission): Promise<Submission> => {
    return new Promise((resolve) => setTimeout(() => resolve(submission), 250))
  },
  // todo return type
  deleteSubmission: (submissionUUID: string): Promise<unknown> => {
    const success = true
    return new Promise((resolve) => setTimeout(() => resolve(success), 250))
  },
}
