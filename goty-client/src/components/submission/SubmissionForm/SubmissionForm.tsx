import { Card } from '../../controls/Card/Card'
import { Giveaway } from '../Giveaway'
import { GOTY } from '../GOTY'
import { MostAnticipated } from '../MostAnticipated'
import { BestOldGame } from '../BestOldGame'
import { Button } from '../../controls/Button/Button'
import styles from './SubmissionForm.module.scss'
import { useProperties } from '../../../api/useProperties'
import { useDocumentTitle } from '../../../util/useDocumentTitle'
import { Game } from '../../../models/game'
import { Name } from '../Name'
import { MostDisappointing } from '../MostDisappointing'
import { SubmissionInputContext, useSubmissionForm } from '../useSubmissionForm'

interface SubmissionFormProps {
  handleDone: () => void
  handleError: (error: any) => void
}
export const SubmissionForm = ({
  handleDone,
  handleError,
}: SubmissionFormProps) => {
  const { properties } = useProperties()
  const { submission, setSubmission, isValid, isDirty, inputs, handleSubmit } =
    useSubmissionForm(handleDone, handleError)

  const handleSetName = (name: string) => {
    setSubmission({
      ...submission,
      name,
    })
  }
  const handleSetBestOldGame = (bestOldGame: Game | null) => {
    setSubmission({
      ...submission,
      bestOldGame,
    })
  }
  const handleSetMostAnticipated = (mostAnticipated: Game | null) => {
    setSubmission({
      ...submission,
      mostAnticipated,
    })
  }

  const handleSetMostDisappointing = (mostDisappointing: Game | null) => {
    setSubmission({
      ...submission,
      mostDisappointing,
    })
  }
  const handleSetEnteredGiveaway = (enteredGiveaway: boolean) => {
    setSubmission({
      ...submission,
      enteredGiveaway,
    })
  }
  const handleSetGames = (gamesOfTheYear: Game[]) => {
    setSubmission({
      ...submission,
      gamesOfTheYear,
    })
  }
  useDocumentTitle('GOTY - Submission')
  return (
    <SubmissionInputContext.Provider value={inputs}>
      <Card>
        <span className={styles.required}>* Required</span>
      </Card>
      <Name
        readonly={false}
        name={submission.name}
        handleSetName={handleSetName}
      />
      <GOTY
        games={submission.gamesOfTheYear}
        readonly={false}
        handleSetGames={handleSetGames}
        properties={properties}
      />
      <BestOldGame
        readonly={false}
        bestOldGame={submission.bestOldGame}
        handleSetBestOldGame={handleSetBestOldGame}
        properties={properties}
      />
      <MostAnticipated
        readonly={false}
        mostAnticipated={submission.mostAnticipated}
        handleSetMostAnticipated={handleSetMostAnticipated}
      />
      <MostDisappointing
        readonly={false}
        mostDisappointing={submission.mostDisappointing}
        handleSetMostDisappointing={handleSetMostDisappointing}
        year={properties.year}
      />
      {properties.hasGiveaway ? (
        <Giveaway
          readonly={false}
          enteredGiveaway={submission.enteredGiveaway}
          handleSetGiveaway={handleSetEnteredGiveaway}
          properties={properties}
        />
      ) : null}
      <Button
        className={styles.submitButton}
        disabled={!(isValid && isDirty)}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </SubmissionInputContext.Provider>
  )
}
