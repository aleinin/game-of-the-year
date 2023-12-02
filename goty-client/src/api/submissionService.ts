import { Submission } from '../models/submission'
import fetcher from './fetcher'
import { localStorageService } from './localStorageService'
import {
  BackendSubmission,
  fromBackendSubmissionToSubmission,
} from './backendModels/backendSubmission'
import {
  BackendSubmissionCreationRequest,
  fromSubmissionToBackendSubmissionCreationRequest,
} from './backendModels/backendSubmissionCreationRequest'
import { BackendSecretSubmission } from './backendModels/backendSecretSubmission'
import { fromSubmissionToBackendSubmissionUpdateRequest } from './backendModels/backendSubmissionUpdateRequest'

export const SubmissionService = {
  getSubmission: (submissionUUID: string): Promise<Submission> =>
    fetcher
      .get<BackendSubmission>(`/submissions/${submissionUUID}`)
      .then(fromBackendSubmissionToSubmission),
  getSubmissions: (): Promise<Submission[]> =>
    fetcher
      .get<BackendSubmission[]>('/submissions')
      .then((response) => response.map(fromBackendSubmissionToSubmission)),
  createSubmission: (submission: Submission): Promise<Submission> =>
    fetcher
      .post<BackendSubmissionCreationRequest, BackendSecretSubmission>(
        '/submissions',
        fromSubmissionToBackendSubmissionCreationRequest(submission),
      )
      .then((secretSubmission): BackendSubmission => {
        const { secret, ...submission } = secretSubmission
        localStorageService.setSubmissionIds(secretSubmission.id, secret)
        return submission
      })
      .then(fromBackendSubmissionToSubmission),
  updateSubmission: (submission: Submission): Promise<Submission> =>
    fetcher
      .put<BackendSubmissionCreationRequest, BackendSubmission>(
        `/submissions/${submission.submissionUUID}`,
        fromSubmissionToBackendSubmissionUpdateRequest(submission),
      )
      .then(fromBackendSubmissionToSubmission)
      .catch((error) => {
        if (error?.cause?.status === 404) {
          const { id, secret } = localStorageService.getSubmissionIds()
          localStorageService.clearIds()
          throw new Error(
            `404: Submission could not be found/verified for id=${id} and secret=${secret}. Submission: ${JSON.stringify(
              submission,
            )}`,
          )
        }
        throw new Error(error)
      }),
}
