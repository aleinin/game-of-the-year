import React, { useEffect, useState } from 'react'
import { SubmissionService } from '../../api/submissionService'
import { End } from './End/End'
import { Form } from './Form/Form'
import { localStorageService } from '../../api/localStorageService'
import { isGotyConcluded } from '../../util/isGotyConcluded'
import { useProperties } from '../../api/useProperties'
import { Concluded } from './Concluded'
import { isEqual, Submission } from '../../models/submission'

const defaultSubmission: Submission = {
  submissionUUID: '',
  name: '',
  gamesOfTheYear: [],
  bestOldGame: null,
  mostAnticipated: null,
  enteredGiveaway: null,
}

const submissionIsValid = (
  form: Submission,
  initialForm: Submission,
  hasGiveaway: boolean,
) =>
  !isEqual(form, initialForm) &&
  form.name?.length > 0 &&
  form.gamesOfTheYear?.length > 0 &&
  (!hasGiveaway || form.enteredGiveaway != null)

export const SubmissionHub = () => {
  const { properties } = useProperties()
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isUpdate, setIsUpdate] = useState(false)
  const [submission, setSubmission] = useState(defaultSubmission)
  const [initialSubmission, setInitialSubmission] = useState(defaultSubmission)
  const isValid = submissionIsValid(
    submission,
    initialSubmission,
    properties.hasGiveaway,
  )
  const resetSubmission = (submission: Submission) => {
    setSubmission(submission)
    setInitialSubmission(submission)
  }
  useEffect(() => {
    const submissionUUID = localStorageService.getSubmissionIds().id
    if (submissionUUID !== '') {
      setIsLoading(true)
      setIsUpdate(true)
      SubmissionService.getSubmission(submissionUUID)
        .then((submission) => {
          resetSubmission(submission)
        })
        .catch((error) => {
          const status = error.response.status
          if (status === 404 || status === 400) {
            localStorage.removeItem('submissionUUID')
            console.error(error)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [])
  if (isGotyConcluded(properties.deadline)) {
    return <Concluded year={properties.year} />
  }
  const handleSubmit = () => {
    const service = isUpdate
      ? SubmissionService.updateSubmission
      : SubmissionService.createSubmission
    service(submission)
      .then((submission) => {
        setIsDone(true)
        resetSubmission(submission)
      })
      .catch((error) => {
        setError(error)
        setIsDone(true)
      })
  }
  return isDone ? (
    <End error={error} handleNextStep={() => setIsDone(false)} />
  ) : (
    <Form
      handleSetSubmission={setSubmission}
      handleSubmitSubmission={handleSubmit}
      isValid={isValid}
      submission={submission}
    />
  )
}
