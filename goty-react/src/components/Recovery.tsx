import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { SubmissionService } from '../api/submissionService'
import { Card } from './Card'

export interface RecoveryProps {}

const Error = styled.h4`
  color: #b00020;
`

const RecoveryForm = styled.div`
  display: flex;
  justify-content: space-between;

  input {
    width: 100%;
    margin-right: 5px;
  }

  p-button {
    align-self: center;
  }
`

const getFailed = () => (
  <React.Fragment>
    <Error>Something went wrong</Error>
    <Error>Unable to recover submission, double check the key</Error>
  </React.Fragment>
)

const uuidPattern =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

// todo css
export const Recovery = () => {
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
        history.push('/submission')
      })
      .catch(() => {
        setValid(false)
        setFailed(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  return (
    <Card
      title="Recover Submission"
      content={
        <React.Fragment>
          <h4>
            If you've lost your submission and you've been redirected to this
            page paste the key you were given below:
          </h4>
          {failed ? getFailed() : null}
          <RecoveryForm>
            <InputText
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              placeholder="Paste key here"
            />
            <Button
              disabled={!valid}
              label="Submit"
              onClick={handleSubmit}
              style={{ minWidth: '120px' }}
              loading={isLoading}
            />
          </RecoveryForm>
        </React.Fragment>
      }
    />
  )
}
