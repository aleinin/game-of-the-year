import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Card } from '../Card'
import { Button } from 'primereact/button'
import { useSelector, useStore } from 'react-redux'
import { selectConstants } from '../../state/constants/selectors'
import { selectIsEdit } from '../../state/submission/selector'
import { createNextStepAction } from '../../state/submission/actions'

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

const concluded = (year: number) => {
  const thankYou = (
    <Card
      content={
        <React.Fragment>
          <h2>Game of the Year {year} has concluded</h2>
          <p>Thank you to all who participated</p>
        </React.Fragment>
      }
    />
  )
  const results = (
    <Card
      title="Results"
      titleFontSize={{ fontSize: 2, fontType: 'em' }}
      content={<p>TODO RESULTS</p>}
    />
  )
  return (
    <React.Fragment>
      {thankYou}
      {results}
    </React.Fragment>
  )
}

const submissions = (
  hasSubmission: boolean,
  isLoading: boolean,
  handleClick: () => void
) => {
  let labelAdjective: string
  if (isLoading) {
    labelAdjective = 'Loading'
  } else if (hasSubmission) {
    labelAdjective = 'Edit'
  } else {
    labelAdjective = 'New'
  }

  return (
    <Card
      content={
        <ButtonSet>
          <Button
            style={{ width: '100%' }}
            label={`${labelAdjective} Submission`}
            onClick={handleClick}
            disabled={isLoading}
            loading={isLoading}
          />
        </ButtonSet>
      }
    />
  )
}

export const Start = (props: StartProps) => {
  const store = useStore()
  const constants = useSelector(selectConstants)
  const hasSubmission: boolean = useSelector(selectIsEdit)
  useEffect(() => {
    document.title = 'TMW GOTY - Start'
  }, [])
  const handleClick = () => {
    store.dispatch(createNextStepAction())
  }
  if (constants.isGotyConcluded) {
    return concluded(constants.year)
  }
  return submissions(hasSubmission, props.isLoading, handleClick)
}
