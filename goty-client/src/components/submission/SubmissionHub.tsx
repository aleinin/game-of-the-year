import { SubmissionForm } from './SubmissionForm/SubmissionForm'
import React, { useEffect, useState } from 'react'
import { SubmissionService } from '../../api/submissionService'
import { isEqual, Submission } from '../../models/submission'
import { localStorageService } from '../../api/localStorageService'
import { useProperties } from '../../api/useProperties'
import { useSubmission } from '../../api/useSubmission'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const defaultSubmission: Submission = {
  submissionUUID: '',
  name: '',
  gamesOfTheYear: [],
  bestOldGame: null,
  mostAnticipated: null,
  enteredGiveaway: null,
}

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
  const [id] = useState(localStorageService.getSubmissionIds().id)
  const { properties } = useProperties()
  const { data } = useSubmission(id)
  const initialSubmission = data ?? defaultSubmission
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
