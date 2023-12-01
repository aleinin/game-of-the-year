import { useEffect, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import { SubmissionService } from '../../api/submissionService'
import { createSetSubmissionAction } from '../../state/submission/actions'
import { selectIsEdit } from '../../state/submission/selector'
import { End } from './End/End'
import { Start } from './Start/Start'
import { Form } from './Form/Form'
import { localStorageService } from '../../api/localStorageService'

const notNull = (input: string | null | undefined): input is string => {
  return (
    input != null && input !== 'undefined' && input !== 'null' && input !== ''
  )
}

export enum SubmissionStep {
  Start,
  Form,
  End,
}

export const SubmissionHub = () => {
  const store = useStore()
  const [submissionStep, setSubmissionStep] = useState(SubmissionStep.Start)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasSubmission = useSelector(selectIsEdit)
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
  switch (submissionStep) {
    case SubmissionStep.Start:
      return (
        <Start
          isLoading={isLoading}
          handleNextStep={() => setSubmissionStep(SubmissionStep.Form)}
          hasSubmission={hasSubmission}
        />
      )
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
