import { useQuery } from '@tanstack/react-query'
import { Submission } from '../models/submission'
import fetcher from './fetcher'
import {
  BackendSubmission,
  fromBackendSubmissionToSubmission,
} from './backendModels/backendSubmission'

const getSubmission = (submissionUUID: string): Promise<Submission> =>
  fetcher
    .get<BackendSubmission>(`/submissions/${submissionUUID}`)
    .then(fromBackendSubmissionToSubmission)

export const useSubmission = (id: string) => {
  console.log(id)
  return useQuery({
    queryKey: ['submission', id],
    queryFn: () => getSubmission(id),
    enabled: id !== '',
    staleTime: Infinity,
  })
}
