import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { SubmissionService } from '../../api/submissionService'
import { createSetSubmissionAction } from '../../state/submission/actions'
import { End } from './End/End'
import { Form } from './Form/Form'
import { localStorageService } from '../../api/localStorageService'
import { isGotyConcluded } from '../../util/isGotyConcluded'
import { useProperties } from '../../api/useProperties'
import { Concluded } from './Concluded'

const notNull = (input: string | null | undefined): input is string => {
  return (
    input != null && input !== 'undefined' && input !== 'null' && input !== ''
  )
}

export enum SubmissionStep {
  Form,
  End,
}

export const SubmissionHub = () => {
  const store = useStore()
  const { properties } = useProperties()
  const [submissionStep, setSubmissionStep] = useState(SubmissionStep.Form)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const submissionUUID = localStorageService.getSubmissionIds().id
    if (notNull(submissionUUID)) {
      setIsLoading(true)
      SubmissionService.getSubmission(submissionUUID)
        .then((submission) => {
          store.dispatch(createSetSubmissionAction(submission))
        })
        .catch((error) => {
          const status = error.response.status
          if (status === 404 || status === 400) {
            localStorage.removeItem('submissionUUID')
          } else {
            console.error(error)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [store])
  const handleError = (error: any) => {
    setError(error)
    setSubmissionStep(SubmissionStep.End)
  }
  if (isGotyConcluded(properties.deadline)) {
    return <Concluded year={properties.year} />
  }
  switch (submissionStep) {
    case SubmissionStep.Form:
      return (
        <Form
          handleNextStep={() => setSubmissionStep(SubmissionStep.End)}
          handleError={handleError}
        />
      )
    case SubmissionStep.End:
      return (
        <End
          error={error}
          handleNextStep={() => setSubmissionStep(SubmissionStep.Form)}
        />
      )
  }
}
