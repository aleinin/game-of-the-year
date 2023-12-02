import { useQuery } from '@tanstack/react-query'
import { SubmissionService } from './submissionService'

const oneMinuteMs = 60000
export const useSubmissions = () => {
  const query = useQuery({
    queryKey: ['submissions'],
    queryFn: SubmissionService.getSubmissions,
    initialData: [],
    staleTime: oneMinuteMs,
    initialDataUpdatedAt: 0,
  })
  return { ...query, submissions: query.data }
}
