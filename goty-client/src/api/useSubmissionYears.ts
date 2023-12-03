import { useQuery } from '@tanstack/react-query'
import { SubmissionService } from './submissionService'

export const useSubmissionYears = () => {
  const query = useQuery({
    queryKey: ['submissionYears'],
    queryFn: SubmissionService.getSubmissionYears,
    initialData: [],
    staleTime: Infinity,
    initialDataUpdatedAt: 0,
  })
  return { ...query, submissionYears: query.data }
}
