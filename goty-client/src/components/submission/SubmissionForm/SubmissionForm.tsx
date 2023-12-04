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
import { Submission } from '../../../models/submission'
import { MostDisappointing } from '../MostDisappointing'

interface SubmissionFormProps {
  submission: Submission
  handleSetSubmission: (submission: Submission) => void
  handleSubmitSubmission: () => void
  isValid: boolean
}
export const SubmissionForm = ({
  submission,
  handleSetSubmission,
  handleSubmitSubmission,
  isValid,
}: SubmissionFormProps) => {
  const { properties } = useProperties()

  const handleSetName = (name: string) => {
    handleSetSubmission({
      ...submission,
      name,
    })
  }
  const handleSetBestOldGame = (bestOldGame: Game | null) => {
    handleSetSubmission({
      ...submission,
      bestOldGame,
    })
  }
  const handleSetMostAnticipated = (mostAnticipated: Game | null) => {
    handleSetSubmission({
      ...submission,
      mostAnticipated,
    })
  }

  const handleSetMostDisappointing = (mostDisappointing: Game | null) => {
    handleSetSubmission({
      ...submission,
      mostDisappointing,
    })
  }
  const handleSetEnteredGiveaway = (enteredGiveaway: boolean) => {
    handleSetSubmission({
      ...submission,
      enteredGiveaway,
    })
  }
  const handleSetGames = (gamesOfTheYear: Game[]) => {
    handleSetSubmission({
      ...submission,
      gamesOfTheYear,
    })
  }
  useDocumentTitle('GOTY - Submission')
  return (
    <>
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
      />
      <BestOldGame
        readonly={false}
        bestOldGame={submission.bestOldGame}
        handleSetBestOldGame={handleSetBestOldGame}
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
        />
      ) : null}
      <Button
        className={styles.submitButton}
        disabled={!isValid}
        onClick={handleSubmitSubmission}
      >
        Submit
      </Button>
    </>
  )
}
