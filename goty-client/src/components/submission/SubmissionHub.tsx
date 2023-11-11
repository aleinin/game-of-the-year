import { useEffect, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import { SubmissionService } from '../../api/submissionService'
import { createSetSubmissionAction } from '../../state/submission/actions'
import { SubmissionStep } from '../../state/submission/reducer'
import { selectSubmissionStep } from '../../state/submission/selector'
import { End } from './End/End'
import { Start } from './Start/Start'
import { Form } from './Form/Form'

const notNull = (input: string | null | undefined): input is string => {
  return input != null && input !== 'undefined' && input !== 'null'
}

export const SubmissionHub = () => {
  const store = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const submissionStep = useSelector(selectSubmissionStep)
  useEffect(() => {
    const submissionUUID = localStorage.getItem('submissionUUID')
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
  switch (submissionStep) {
    case SubmissionStep.Start:
      return <Start isLoading={isLoading} />
    case SubmissionStep.Form:
      return <Form />
    case SubmissionStep.End:
      return <End />
  }
}
