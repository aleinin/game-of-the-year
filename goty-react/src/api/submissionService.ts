import { Submission } from '../models/submission'
import { allSubmissions, theSubmission } from './mockData'

export const SubmissionService = {
  getSubmission: (submissionUUID: string): Promise<Submission> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(theSubmission), 250)
    )
  },
  getSubmissions: (): Promise<Submission[]> => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(allSubmissions), 250)
    )
  },
  createSubmission: (submission: Submission): Promise<boolean> => {
    const success = true
    return new Promise((resolve) => setTimeout(() => resolve(success), 250))
  },
  updateSubmission: (submission: Submission): Promise<boolean> => {
    const success = true
    return new Promise((resolve) => setTimeout(() => resolve(success), 250))
  },
  deleteSubmission: (submissionUUID: string): Promise<boolean> => {
    const success = true
    return new Promise((resolve) => setTimeout(() => resolve(success), 250))
  },
}
