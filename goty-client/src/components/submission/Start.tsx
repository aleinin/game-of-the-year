import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Card } from '../Card'
import { useSelector, useStore } from 'react-redux'
import { selectIsEdit } from '../../state/submission/selector'
import { createNextStepAction } from '../../state/submission/actions'
import { ResultsContainer } from '../results/ResultsContainer'
import { loadResults } from '../../state/results/middleware'
import { selectProperties } from '../../state/properties/selectors'
import { Button } from '../controls/Button/Button'

export interface StartProps {
  isLoading: boolean
}

const ButtonSet = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;
`

const Concluded = ({ year }: { year: number }) => {
  return (
    <>
      <Card>
        <h2>Game of the Year {year} has concluded</h2>
        <p>Thank you to all who participated</p>
      </Card>
      <Card title="Results" titleFontSize={{ fontSize: 2, fontType: 'em' }}>
        <ResultsContainer />
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
      <ButtonSet>
        <Button disabled={isLoading} onClick={handleClick}>
          {labelAdjective} Submission
        </Button>
      </ButtonSet>
    </Card>
  )
}

export const Start = (props: StartProps) => {
  const store = useStore()
  const properties = useSelector(selectProperties)
  const hasSubmission: boolean = useSelector(selectIsEdit)
  useEffect(() => {
    document.title = 'TMW GOTY - Start'
    if (properties.isGotyConcluded) {
      loadResults(store)
    }
  }, [properties, store])
  const handleClick = () => {
    store.dispatch(createNextStepAction())
  }
  if (properties.isGotyConcluded) {
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
