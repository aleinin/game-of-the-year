import { useProperties } from '../../api/useProperties'
import { isEqual, Submission } from '../../models/submission'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useUnsavedChangesWarning } from '../../util/useUnsavedChangesWarning'
import { useSubmission } from '../../api/useSubmission'
import { useSubmissionIds } from '../../api/useSubmissionIds'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SubmissionService } from '../../api/submissionService'

type InputState = [string, (value: string) => void]
const initialInputState: InputState = ['', () => {}]
export interface SubmissionInputsState {
  goty: InputState
  mostDisappointing: InputState
  mostAnticipated: InputState
  bestOldGame: InputState
}
export const SubmissionInputContext = createContext<SubmissionInputsState>({
  goty: initialInputState,
  mostDisappointing: initialInputState,
  mostAnticipated: initialInputState,
  bestOldGame: initialInputState,
})
export const InputStateKeyContext =
  createContext<keyof SubmissionInputsState>('goty')
export interface SubmissionInputsState {
  goty: InputState
  mostDisappointing: InputState
  mostAnticipated: InputState
  bestOldGame: InputState
}

const submissionIsValid = (
  submission: Submission,
  hasGiveaway: boolean,
  inputs: SubmissionInputsState,
) =>
  submission.name?.length > 0 &&
  submission.gamesOfTheYear?.length > 0 &&
  (!hasGiveaway || submission.enteredGiveaway != null) &&
  Object.values(inputs).every(([value]) => value === '')

interface SubmissionState {
  submission: Submission
  setSubmission: (submission: Submission) => void
  inputs: SubmissionInputsState
  isDirty: boolean
  isValid: boolean
  handleSubmit: () => void
}
export const useSubmissionForm = (
  handleDone: () => void,
  handleError: (error: any) => void,
): SubmissionState => {
  const queryClient = useQueryClient()
  const { id } = useSubmissionIds()
  const { data: initialSubmission } = useSubmission(id)
  const { properties } = useProperties()
  const [submission, setSubmission] = useState<Submission>(initialSubmission)
  const inputs: SubmissionInputsState = {
    goty: useState(''),
    mostDisappointing: useState(''),
    mostAnticipated: useState(''),
    bestOldGame: useState(''),
  }
  const isDirty =
    !isEqual(submission, initialSubmission) ||
    Object.values(inputs).some(([value]) => value !== '')
  useUnsavedChangesWarning(isDirty)
  const upsertSubmissionMutation = useMutation({
    mutationFn: (newSubmission: Submission) =>
      id !== ''
        ? SubmissionService.updateSubmission(newSubmission)
        : SubmissionService.createSubmission(newSubmission),
    onSuccess: (newSubmission) => {
      queryClient.setQueryData(['submission', id], newSubmission)
      handleDone()
    },
    onError: (error) => {
      handleError(error)
    },
  })
  useEffect(() => {
    setSubmission(initialSubmission)
  }, [initialSubmission, setSubmission])
  const handleSubmit = useCallback(() => {
    upsertSubmissionMutation.mutate(submission)
  }, [upsertSubmissionMutation, submission])
  return {
    submission,
    setSubmission,
    inputs,
    isDirty,
    isValid: submissionIsValid(submission, properties.hasGiveaway, inputs),
    handleSubmit,
  }
}
