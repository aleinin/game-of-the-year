import React, { useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'
import { selectProperties } from '../../../state/properties/selectors'
import { createNextStepAction } from '../../../state/submission/actions'
import { selectError } from '../../../state/submission/selector'
import { Card } from '../../controls/Card/Card'
import styles from './End.module.scss'
import { CodeBox } from '../../controls/CodeBox/CodeBox'

export const End = () => {
  const store = useStore()
  const { deadline } = useSelector(selectProperties)
  const error = useSelector(selectError)
  const handleEditClick = () => {
    store.dispatch(createNextStepAction())
  }
  useEffect(() => {
    document.title = 'TMW GOTY - End'
  }, [])
  return (
    <Card>
      {error != null ? (
        <FailSubmission error={error} />
      ) : (
        <SuccessfulSubmission
          deadline={deadline}
          handleClick={handleEditClick}
        />
      )}
    </Card>
  )
}

interface SuccessfulSubmissionProps {
  deadline: string
  handleClick: () => void
}
const SuccessfulSubmission = ({
  deadline,
  handleClick,
}: SuccessfulSubmissionProps) => (
  <>
    <h1>Thank you!</h1>
    <h2>Your submission has been received</h2>
    <h3>
      You may edit your submission{' '}
      <button className={styles.link} onClick={handleClick}>
        here
      </button>
    </h3>
    <h3>All edits are due by {deadline}</h3>
  </>
)

interface FailSubmissionProps {
  error: any
}
const FailSubmission = ({ error }: FailSubmissionProps) => (
  <>
    <h1>Uh oh!</h1>
    <h2>We failed to save your submission</h2>
    <h3>Please contact Kherven and give him the following: </h3>
    <CodeBox
      content={JSON.stringify(error, Object.getOwnPropertyNames(error))}
    />
  </>
)
