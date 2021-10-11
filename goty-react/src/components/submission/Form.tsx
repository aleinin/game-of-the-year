import React, { useEffect } from 'react'
import { Required } from '../../util/global-styles'
import { Card } from '../Card'
import { Giveaway } from './Giveaway'
import { GOTY } from './GOTY'
import { MostAnticipated } from './MostAnticipated'
import { Name } from './Name'
import { OldGame } from './OldGame'
import { useSelector, useStore } from 'react-redux'
import { SubmissionService } from '../../api/submissionService'
import { selectSubmissionState } from '../../state/submission/selector'
import {
  createSubmitFailAction,
  createSubmitSuccessAction,
} from '../../state/submission/actions'
import { GotyButton } from '../restyled/GotyButton'

export interface FormProps {}
export const Form = (props: FormProps) => {
  const store = useStore()
  const { isValid, isEdit, form } = useSelector(selectSubmissionState)
  const handleSubmit = () => {
    const service = isEdit
      ? SubmissionService.updateSubmission
      : SubmissionService.createSubmission
    service(form)
      .then((submission) => {
        localStorage.setItem('submissionUUID', submission.submissionUUID)
        store.dispatch(createSubmitSuccessAction(submission))
      })
      .catch((error) => {
        store.dispatch(createSubmitFailAction(error))
      })
  }
  useEffect(() => {
    document.title = 'TMW GOTY - Submission'
  }, [])
  return (
    <React.Fragment>
      <Card>
        <Required>* Required</Required>
      </Card>
      <Name readonly={false} name={form.name} />
      <GOTY games={form.gamesOfTheYear} readonly={false} />
      <OldGame readonly={false} bestOldGame={form.bestOldGame} />
      <MostAnticipated
        readonly={false}
        mostAnticipated={form.mostAnticipated}
      />
      <Giveaway readonly={false} enteredGiveaway={form.enteredGiveaway} />
      <GotyButton
        style={{ width: '100%' }}
        disabled={!isValid}
        label="Submit"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}
