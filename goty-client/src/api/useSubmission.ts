import { useQuery } from '@tanstack/react-query'
import { SubmissionService } from './submissionService'

export const useSubmission = (id: string) =>
  useQuery({
    queryKey: ['submission', id],
    queryFn: () => SubmissionService.getSubmission(id),
    enabled: id !== '',
    staleTime: Infinity,
  })
