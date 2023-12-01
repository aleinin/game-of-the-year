import React from 'react'
import { Card } from '../../controls/Card/Card'
import { Giveaway } from '../Giveaway'
import { GOTY } from '../GOTY'
import { MostAnticipated } from '../MostAnticipated'
import { Name } from '../Name/Name'
import { BestOldGame } from '../BestOldGame'
import { useSelector, useStore } from 'react-redux'
import { SubmissionService } from '../../../api/submissionService'
import { selectSubmissionState } from '../../../state/submission/selector'
import {
  createSubmitSuccessAction,
  createUpdateBestOldGameAction,
  createUpdateEnteredGiveawayAction,
  createUpdateGamesOfTheYearAction,
  createUpdateMostAnticipatedAction,
  createUpdateNameAction,
} from '../../../state/submission/actions'
import { Button } from '../../controls/Button/Button'
import styles from './Form.module.scss'
import { useProperties } from '../../../api/useProperties'
import { useDocumentTitle } from '../../../util/useDocumentTitle'
import { Game } from '../../../models/game'

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
  const handleSetName = (name: string) => {
    store.dispatch(createUpdateNameAction(name))
  }
  const handleSetBestOldGame = (bestOldGame: Game | null) => {
    store.dispatch(createUpdateBestOldGameAction(bestOldGame))
  }
  const handleSetMostAnticipated = (mostAnticipated: Game | null) => {
    store.dispatch(createUpdateMostAnticipatedAction(mostAnticipated))
  }
  const handleSetEnteredGiveaway = (enteredGiveaway: boolean) => {
    store.dispatch(createUpdateEnteredGiveawayAction(enteredGiveaway))
  }
  const handleSetGames = (games: Game[]) => {
    store.dispatch(createUpdateGamesOfTheYearAction(games))
  }
  useDocumentTitle('GOTY - Submission')
  return (
    <>
      <Card>
        <span className={styles.required}>* Required</span>
      </Card>
      <Name readonly={false} name={form.name} handleSetName={handleSetName} />
      <GOTY
        games={form.gamesOfTheYear}
        readonly={false}
        handleSetGames={handleSetGames}
      />
      <BestOldGame
        readonly={false}
        bestOldGame={form.bestOldGame}
        handleSetBestOldGame={handleSetBestOldGame}
      />
      <MostAnticipated
        readonly={false}
        mostAnticipated={form.mostAnticipated}
        handleSetMostAnticipated={handleSetMostAnticipated}
      />
      {properties.hasGiveaway ? (
        <Giveaway
          readonly={false}
          enteredGiveaway={form.enteredGiveaway}
          handleSetGiveaway={handleSetEnteredGiveaway}
        />
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
