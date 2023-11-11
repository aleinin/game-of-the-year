import { Card } from '../../controls/Card/Card'
import { useStore } from 'react-redux'
import { createUpdateNameAction } from '../../../state/submission/actions'
import { useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../../util/use-debounced-effect'
import { TextInput } from '../../controls/TextInput/TextInput'
import styles from './Name.module.scss'

export interface NameProps {
  name: string
  readonly: boolean
}

export const Name = ({ name, readonly }: NameProps) => {
  const [localName, setLocalName] = useState(name)
  const store = useStore()
  useEffect(() => {
    setLocalName(name)
  }, [name])
  useDebouncedEffect(
    () => store.dispatch(createUpdateNameAction(localName)),
    [localName],
    500,
  )
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
