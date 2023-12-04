import { SubmissionForm } from './SubmissionForm/SubmissionForm'
import { useEffect, useState } from 'react'
import { SubmissionService } from '../../api/submissionService'
import { isEqual, Submission } from '../../models/submission'
import { useProperties } from '../../api/useProperties'
import { useSubmission } from '../../api/useSubmission'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSubmissionIds } from '../../api/useSubmissionIds'
import { useUnsavedChangesWarning } from '../../util/useUnsavedChangesWarning'

const submissionIsValid = (
  submission: Submission,
  initialForm: Submission,
  hasGiveaway: boolean,
) =>
  !isEqual(submission, initialForm) &&
  submission.name?.length > 0 &&
  submission.gamesOfTheYear?.length > 0 &&
  (!hasGiveaway || submission.enteredGiveaway != null)

interface SubmissionHubProps {
  handleDone: () => void
  handleError: (error: any) => void
}
export const SubmissionHub = ({
  handleDone,
  handleError,
}: SubmissionHubProps) => {
  const queryClient = useQueryClient()
  const { id } = useSubmissionIds()
  const { properties } = useProperties()
  const { data } = useSubmission(id)
  const initialSubmission = data
  const [submission, setSubmission] = useState<Submission>(initialSubmission)
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
  const isValid = submissionIsValid(
    submission,
    initialSubmission,
    properties.hasGiveaway,
  )
  useUnsavedChangesWarning(isValid)
  useEffect(() => {
    setSubmission(initialSubmission)
  }, [initialSubmission])
  const handleSubmit = () => {
    upsertSubmissionMutation.mutate(submission)
  }
  return (
    <SubmissionForm
      handleSetSubmission={setSubmission}
      handleSubmitSubmission={handleSubmit}
      isValid={isValid}
      submission={submission}
    />
  )
}
