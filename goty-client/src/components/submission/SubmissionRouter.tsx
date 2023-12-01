import React, { useState } from 'react'
import { End } from './End/End'
import { isGotyConcluded } from '../../util/isGotyConcluded'
import { useProperties } from '../../api/useProperties'
import { Concluded } from './Concluded'
import { SubmissionHub } from './SubmissionHub'

export const SubmissionRouter = () => {
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState(null)

  const { properties } = useProperties()

  if (isGotyConcluded(properties.deadline)) {
    return <Concluded year={properties.year} />
  }
  const handleError = (newError: any) => {
    setError(newError)
    setIsDone(true)
  }
  return isDone ? (
    <End error={error} handleDone={() => setIsDone(false)} />
  ) : (
    <SubmissionHub
      handleDone={() => setIsDone(true)}
      handleError={handleError}
    />
  )
}
