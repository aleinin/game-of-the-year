import { useQuery } from '@tanstack/react-query'
import fetcher from './fetcher'

const getSubmissionYears = (): Promise<string[]> =>
  fetcher.get<string[]>('/results/years')

export const useSubmissionYears = () => {
  const query = useQuery({
    queryKey: ['submissionYears'],
    queryFn: getSubmissionYears,
    initialData: [],
    staleTime: Infinity,
    initialDataUpdatedAt: 0,
  })
  return { ...query, submissionYears: query.data }
}
