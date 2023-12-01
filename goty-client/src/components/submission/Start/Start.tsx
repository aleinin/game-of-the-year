import React, { useEffect } from 'react'
import { Card } from '../../controls/Card/Card'
import { Button } from '../../controls/Button/Button'
import styles from './Start.module.scss'
import { Summary } from '../../results/Summary/Summary'
import { isGotyConcluded } from '../../../util/isGotyConcluded'
import { useProperties } from '../../../api/useProperties'

export interface StartProps {
  isLoading: boolean
  handleNextStep: () => void
  hasSubmission: boolean
}

const Concluded = ({ year }: { year: number }) => {
  return (
    <>
      <Card>
        <h2>Game of the Year {year} has concluded</h2>
        <p>Thank you to all who participated</p>
      </Card>
      <Card title="Results" titleFontSize="2em">
        <Summary />
      </Card>
    </>
  )
}

const SubmissionButtons = ({
  hasSubmission,
  isLoading,
  handleClick,
}: {
  hasSubmission: boolean
  isLoading: boolean
  handleClick: () => void
}) => {
  let labelAdjective: string
  if (isLoading) {
    labelAdjective = 'Loading'
  } else if (hasSubmission) {
    labelAdjective = 'Edit'
  } else {
    labelAdjective = 'New'
  }

  return (
    <Card>
      <div className={styles.buttonSet}>
        <Button disabled={isLoading} onClick={handleClick}>
          {labelAdjective} Submission
        </Button>
      </div>
    </Card>
  )
}

export const Start = ({
  isLoading,
  hasSubmission,
  handleNextStep,
}: StartProps) => {
  const { properties } = useProperties()
  useEffect(() => {
    document.title = 'GOTY - Start'
  }, [])
  if (isGotyConcluded(properties.deadline)) {
    return <Concluded year={properties.year} />
  }
  return (
    <SubmissionButtons
      hasSubmission={hasSubmission}
      isLoading={isLoading}
      handleClick={handleNextStep}
    />
  )
}
