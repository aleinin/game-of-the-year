import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { SubmissionService } from '../api/submissionService'
import { createNextStepAction } from '../state/submission/actions'
import { Card } from './Card'
import { GotyInputWithSubmitButton } from './restyled/GotyInputWithSubmitButton'

export interface RecoveryProps {}

const Error = styled.h4`
  color: #b00020;
`

const getFailed = () => (
  <React.Fragment>
    <Error>Something went wrong</Error>
    <Error>Unable to recover submission, double check the key</Error>
  </React.Fragment>
)

const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export const Recovery = () => {
  const store = useStore()
  const history = useHistory()
  const [failed, setFailed] = useState(false)
  const [valid, setValid] = useState(false)
  const [uuid, setUuid] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setFailed(false)
    setValid(uuidPattern.test(uuid))
  }, [uuid])
  useEffect(() => {
    document.title = 'TMW GOTY - Recovery'
  }, [])
  const handleSubmit = () => {
    setIsLoading(true)
    SubmissionService.getSubmission(uuid)
      .then((submission) => {
        localStorage.setItem('submissionUUID', uuid)
        store.dispatch(createNextStepAction())
        history.push('/submission')
      })
      .catch(() => {
        setIsLoading(false)
        setValid(false)
        setFailed(true)
      })
  }
  return (
    <Card title="Recover Submission">
      <h4>
        If you've lost your submission and you've been redirected to this page
        paste the key you were given below:
      </h4>
      {failed ? getFailed() : null}
      <GotyInputWithSubmitButton
        value={uuid}
        onChange={(e) => setUuid(e.target.value)}
        placeholder="Paste key here"
        disabled={!valid}
        label="Submit"
        onClick={handleSubmit}
        buttonStyle={{ minWidth: '120px' }}
        loading={isLoading}
      />
    </Card>
  )
}
