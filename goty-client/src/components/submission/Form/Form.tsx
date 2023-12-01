import React from 'react'
import { Card } from '../../controls/Card/Card'
import { Giveaway } from '../Giveaway'
import { GOTY } from '../GOTY'
import { MostAnticipated } from '../MostAnticipated'
import { Name } from '../Name/Name'
import { OldGame } from '../OldGame'
import { useSelector, useStore } from 'react-redux'
import { SubmissionService } from '../../../api/submissionService'
import { selectSubmissionState } from '../../../state/submission/selector'
import { createSubmitSuccessAction } from '../../../state/submission/actions'
import { Button } from '../../controls/Button/Button'
import styles from './Form.module.scss'
import { useProperties } from '../../../api/useProperties'
import { useDocumentTitle } from '../../../util/useDocumentTitle'

interface FormProps {
  handleNextStep: () => void
  handleError: (error: any) => void
}
export const Form = ({ handleNextStep, handleError }: FormProps) => {
  const store = useStore()
  const { isValid, isEdit, form } = useSelector(selectSubmissionState)
  const { properties } = useProperties()
  const handleSubmit = () => {
    const service = isEdit
      ? SubmissionService.updateSubmission
      : SubmissionService.createSubmission
    service(form)
      .then((submission) => {
        store.dispatch(createSubmitSuccessAction(submission))
        handleNextStep()
      })
      .catch((error) => {
        handleError(error)
      })
  }
  useDocumentTitle('GOTY - Submission')
  return (
    <>
      <Card>
        <span className={styles.required}>* Required</span>
      </Card>
      <Name readonly={false} name={form.name} />
      <GOTY games={form.gamesOfTheYear} readonly={false} />
      <OldGame readonly={false} bestOldGame={form.bestOldGame} />
      <MostAnticipated
        readonly={false}
        mostAnticipated={form.mostAnticipated}
      />
      {properties.hasGiveaway ? (
        <Giveaway readonly={false} enteredGiveaway={form.enteredGiveaway} />
      ) : null}
      <Button
        className={styles.submitButton}
        disabled={!isValid}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </>
  )
}
