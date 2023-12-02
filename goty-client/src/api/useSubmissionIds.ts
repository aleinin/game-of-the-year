import { useMemo } from 'react'
import { localStorageService } from './localStorageService'

export const useSubmissionIds = () => {
  return useMemo(() => localStorageService.getSubmissionIds(), [])
}
