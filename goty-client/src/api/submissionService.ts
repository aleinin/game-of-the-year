import { Converter } from '../util/converter'
import { Submission } from '../models/submission'
import { Game } from '../models/game'
import fetcher from './fetcher'

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
    return fetcher
      .get<BackendSubmission>(`/submissions/${submissionUUID}`)
      .then(Converter.convertFromBackendToSubmission)
  },
  getSubmissions: (): Promise<Submission[]> => {
    return fetcher
      .get<BackendSubmission[]>('/submissions')
      .then((response) =>
        response.map(Converter.convertFromBackendToSubmission),
      )
  },
  createSubmission: (submission: Submission): Promise<Submission> => {
    return fetcher
      .post<BackendSubmissionRequest, BackendSubmission>(
        '/submissions',
        Converter.convertToBackendSubmissionRequest(submission),
      )
      .then(Converter.convertFromBackendToSubmission)
  },
  updateSubmission: (submission: Submission): Promise<Submission> => {
    return fetcher
      .put<BackendSubmissionRequest, BackendSubmission>(
        `/submissions/${submission.submissionUUID}`,
        Converter.convertToBackendSubmissionRequest(submission),
      )
      .then(Converter.convertFromBackendToSubmission)
  },
}
