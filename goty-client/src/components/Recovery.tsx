import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SubmissionService } from '../api/submissionService'
import { createNextStepAction } from '../state/submission/actions'
import { Card } from './Card'
import { TextInput } from './controls/TextInput'
import { Button } from './controls/Button'

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
`

const Error = styled.h4`
  color: #b00020;
`

const getFailed = () => (
  <>
    <Error>Something went wrong</Error>
    <Error>Unable to recover submission, double check the key</Error>
  </>
)

const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

export const Recovery = () => {
  const store = useStore()
  const navigate = useNavigate()
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
      .then(() => {
        localStorage.setItem('submissionUUID', uuid)
        store.dispatch(createNextStepAction())
        navigate('/submission')
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
      <StyledContainer>
        <TextInput
          id="recovery"
          value={uuid}
          onChange={setUuid}
          placeholder="Paste key here"
        />
        <Button
          disabled={!valid}
          label="Submit"
          onClick={handleSubmit}
          style={{ minWidth: '120px' }}
          loading={isLoading}
        />
      </StyledContainer>
    </Card>
  )
}
