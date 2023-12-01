import { Submission } from '../models/submission'
import fetcher from './fetcher'
import {
  BackendSubmission,
  fromBackendSubmissionToSubmission,
} from './backendModels/backendSubmission'
import { useQuery } from '@tanstack/react-query'

const getSubmissions = (): Promise<Submission[]> =>
  fetcher
    .get<BackendSubmission[]>('/submissions')
    .then((response) => response.map(fromBackendSubmissionToSubmission))

export const useSubmissions = () => {
  const query = useQuery({
    queryKey: ['submissions'],
    queryFn: getSubmissions,
    initialData: [],
  })
  return { ...query, submissions: query.data }
}
