import { Card } from '../../controls/Card/Card'
import styles from './End.module.scss'
import { CodeBox } from '../../controls/CodeBox/CodeBox'
import { useProperties } from '../../../api/useProperties'
import { useDocumentTitle } from '../../../util/useDocumentTitle'
import { useSubmissionIds } from '../../../api/useSubmissionIds'

interface EndProps {
  error: any
  handleDone: () => void
}

export const End = ({ error, handleDone }: EndProps) => {
  const { properties } = useProperties()
  const { id, secret } = useSubmissionIds()
  useDocumentTitle('GOTY - End')
  return (
    <Card>
      {error != null ? (
        <FailSubmission error={error} />
      ) : (
        <SuccessfulSubmission
          deadline={properties.deadline}
          handleClick={handleDone}
          recoveryLink={`${window.location.origin}/recovery?id=${id}&secret=${secret}`}
        />
      )}
    </Card>
  )
}

interface SuccessfulSubmissionProps {
  deadline: string
  handleClick: () => void
  recoveryLink: string
}
const SuccessfulSubmission = ({
  deadline,
  handleClick,
  recoveryLink,
}: SuccessfulSubmissionProps) => (
  <>
    <h1>Thank you!</h1>
    <h2>Your submission has been received</h2>
    <h3>
      You can edit your submission{' '}
      <button className={styles.link} onClick={handleClick}>
        here
      </button>{' '}
      or by accessing the following link to edit on other devices.
    </h3>
    <a className={styles.recoveryLink} href={recoveryLink}>
      {recoveryLink}
    </a>
    <h3>Do not share this link as it can be used to edit your submission</h3>
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
