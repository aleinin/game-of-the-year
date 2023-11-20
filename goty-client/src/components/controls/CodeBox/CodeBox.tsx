import styles from './CodeBox.module.scss'
import { Button } from '../Button/Button'
import { useCallback, useState } from 'react'
interface CodeBoxProps {
  content: string
}

const COPY = 'Copy'
const COPIED = 'Copied!'

export const CodeBox = ({ content }: CodeBoxProps) => {
  const [buttonText, setButtonText] = useState(COPY)
  const handleClick = useCallback(() => {
    setTimeout(() => {
      setButtonText(COPY)
    }, 3000)
    navigator.clipboard.writeText(content).then(() => setButtonText(COPIED))
  }, [content])
  return (
    <div className={styles.codeContainer}>
      <div className={styles.codeBox}>{content}</div>
      <Button disabled={buttonText === COPIED} onClick={handleClick}>
        {buttonText}
      </Button>
    </div>
  )
}
