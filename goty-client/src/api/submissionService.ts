import axios, { AxiosResponse } from 'axios'
import { Converter } from '../util/converter'
import { Submission } from '../models/submission'
import { Game } from '../models/game'

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
    return axios
      .get<BackendSubmission>(`/submissions/${submissionUUID}`)
      .then((response) =>
        Converter.convertFromBackendToSubmission(response.data),
      )
  },
  getSubmissions: (): Promise<Submission[]> => {
    return axios
      .get<BackendSubmission[]>('/submissions')
      .then((response) =>
        response.data.map((submission) =>
          Converter.convertFromBackendToSubmission(submission),
        ),
      )
  },
  createSubmission: (submission: Submission): Promise<Submission> => {
    return axios
      .post<BackendSubmissionRequest, AxiosResponse<BackendSubmission>>(
        '/submissions',
        Converter.convertToBackendSubmissionRequest(submission),
      )
      .then((response) =>
        Converter.convertFromBackendToSubmission(response.data),
      )
  },
  updateSubmission: (submission: Submission): Promise<Submission> => {
    return axios
      .put<BackendSubmissionRequest, AxiosResponse<BackendSubmission>>(
        `/submissions/${submission.submissionUUID}`,
        Converter.convertToBackendSubmissionRequest(submission),
      )
      .then((response) =>
        Converter.convertFromBackendToSubmission(response.data),
      )
  },
  // TODO #11
  deleteSubmission: (submissionUUID: string): Promise<unknown> => {
    throw new Error('Not implemented')
  },
}
