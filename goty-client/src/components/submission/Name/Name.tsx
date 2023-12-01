import { Card } from '../../controls/Card/Card'
import { useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../../util/useDebouncedEffect'
import { TextInput } from '../../controls/TextInput/TextInput'
import styles from './Name.module.scss'

export interface NameProps {
  name: string
  readonly: boolean
  handleSetName: (name: string) => void
}

export const Name = ({ name, readonly, handleSetName }: NameProps) => {
  const [localName, setLocalName] = useState(name)
  useEffect(() => {
    setLocalName(name)
  }, [name])
  useDebouncedEffect(() => handleSetName(localName), [localName], 500)
  const handleChange = (input: string) =>
    readonly ? () => {} : setLocalName(input)
  return (
    <Card title="Name:" required={true}>
      <div className={styles.marginTop20}>
        <TextInput
          id="name"
          value={readonly ? name : localName}
          disabled={readonly}
          onChange={handleChange}
          placeholder="Your Name"
        />
      </div>
    </Card>
  )
}
