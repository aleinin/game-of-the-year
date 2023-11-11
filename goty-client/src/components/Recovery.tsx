import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SubmissionService } from '../api/submissionService'
import { createNextStepAction } from '../state/submission/actions'
import { Card } from './controls/Card/Card'
import { TextInput } from './controls/TextInput/TextInput'
import { Button } from './controls/Button/Button'
import styles from './Recovery.module.scss'

const getFailed = () => (
  <>
    <h4 className={styles.error}>Something went wrong</h4>
    <h4 className={styles.error}>
      Unable to recover submission, double check the key
    </h4>
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
  useEffect(() => {
    setFailed(false)
    setValid(uuidPattern.test(uuid))
  }, [uuid])
  useEffect(() => {
    document.title = 'TMW GOTY - Recovery'
  }, [])
  const handleSubmit = () => {
    SubmissionService.getSubmission(uuid)
      .then(() => {
        localStorage.setItem('submissionUUID', uuid)
        store.dispatch(createNextStepAction())
        navigate('/submission')
      })
      .catch(() => {
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
      <div className={styles.container}>
        <TextInput
          id="recovery"
          value={uuid}
          onChange={setUuid}
          placeholder="Paste key here"
        />
        <Button
          disabled={!valid}
          onClick={handleSubmit}
          style={{ minWidth: '120px' }}
        >
          Submit
        </Button>
      </div>
    </Card>
  )
}
