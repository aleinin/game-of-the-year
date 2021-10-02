import React, { useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'
import { selectConstants } from '../../state/constants/selectors'
import { createNextStepAction } from '../../state/submission/actions'
import { selectError } from '../../state/submission/selector'
import { LinkButton } from '../../util/global-styles'
import { Card } from '../Card'

export interface EndProps {}

export const End = (props: EndProps) => {
  const store = useStore()
  const { closeDate } = useSelector(selectConstants)
  const error = useSelector(selectError)
  const handleEditClick = () => {
    store.dispatch(createNextStepAction())
  }
  useEffect(() => {
    document.title = 'TMW GOTY - End'
  }, [])
  let content: JSX.Element
  if (error != null) {
    content = (
      <React.Fragment>
        <h1>Uh oh!</h1>
        <h2>We failed to save your submission</h2>
        <h3>Please contact Kherven or Gorlah and give them the following: </h3>
        <p>{JSON.stringify(error)}</p>
      </React.Fragment>
    )
  } else {
    content = (
      <React.Fragment>
        <h1>Thank you!</h1>
        <h2>Your submission has been received</h2>
        <h3>
          You may edit your submission{' '}
          <LinkButton onClick={handleEditClick}>here</LinkButton>
        </h3>
        <h3>All edits are due by {closeDate}</h3>
      </React.Fragment>
    )
  }
  return <Card content={content} />
}
