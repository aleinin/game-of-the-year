import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Card } from '../Card'
import { useSelector, useStore } from 'react-redux'
import { selectIsEdit } from '../../state/submission/selector'
import { createNextStepAction } from '../../state/submission/actions'
import { ResultsContainer } from '../results/ResultsContainer'
import { loadResults } from '../../state/results/middleware'
import { GotyButton } from '../styled-controls/GotyButton'
import { selectProperties } from '../../state/properties/selectors'

export interface StartProps {
  isLoading: boolean
}

const ButtonSet = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;

  p-button {
    margin-top: 10px;
  }
`

const Concluded = ({ year }: { year: number }) => {
  return (
    <React.Fragment>
      <Card>
        <h2>Game of the Year {year} has concluded</h2>
        <p>Thank you to all who participated</p>
      </Card>
      <Card title="Results" titleFontSize={{ fontSize: 2, fontType: 'em' }}>
        <ResultsContainer />
      </Card>
    </React.Fragment>
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
        <GotyButton
          style={{ width: '100%' }}
          label={`${labelAdjective} Submission`}
          onClick={handleClick}
          disabled={isLoading}
          loading={isLoading}
        />
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
