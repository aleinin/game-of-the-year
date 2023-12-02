import { useQuery } from '@tanstack/react-query'
import { SubmissionService } from './submissionService'
import { Submission } from '../models/submission'

const defaultSubmission: Submission = {
  submissionUUID: '',
  name: '',
  gamesOfTheYear: [],
  bestOldGame: null,
  mostAnticipated: null,
  enteredGiveaway: null,
}

export const useSubmission = (id: string) =>
  useQuery({
    queryKey: ['submission', id],
    queryFn: () => SubmissionService.getSubmission(id),
    enabled: id !== '',
    staleTime: Infinity,
    initialData: defaultSubmission,
    initialDataUpdatedAt: 0,
  })
