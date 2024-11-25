import { useQuery } from '@tanstack/react-query'
import { SubmissionService } from './submissionService'

const oneMinuteMs = 60000
export const useSubmissions = (year: string) => {
  const query = useQuery({
    queryKey: ['submissions', year],
    queryFn: () => SubmissionService.getSubmissions(year),
    initialData: [],
    staleTime: oneMinuteMs,
    initialDataUpdatedAt: 0,
  })
  return { ...query, submissions: query.data }
}
