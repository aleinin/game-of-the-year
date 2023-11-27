import React, { useEffect } from 'react'
import { Card } from '../../controls/Card/Card'
import { useSelector, useStore } from 'react-redux'
import { selectIsEdit } from '../../../state/submission/selector'
import { createNextStepAction } from '../../../state/submission/actions'
import { loadResults } from '../../../state/results/middleware'
import { selectProperties } from '../../../state/properties/selectors'
import { Button } from '../../controls/Button/Button'
import styles from './Start.module.scss'
import { Summary } from '../../results/Summary/Summary'
import { isGotyConcluded } from '../../../util/isGotyConcluded'

export interface StartProps {
  isLoading: boolean
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

export const Start = (props: StartProps) => {
  const store = useStore()
  const properties = useSelector(selectProperties)
  const hasSubmission: boolean = useSelector(selectIsEdit)
  useEffect(() => {
    document.title = 'GOTY - Start'
    if (isGotyConcluded(properties.deadline)) {
      loadResults(store)
    }
  }, [properties, store])
  const handleClick = () => {
    store.dispatch(createNextStepAction())
  }
  if (isGotyConcluded(properties.deadline)) {
    return <Concluded year={properties.year} />
  }
  return (
    <SubmissionButtons
      hasSubmission={hasSubmission}
      isLoading={props.isLoading}
      handleClick={handleClick}
    />
  )
}
