import { ChangeEvent, useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../util/useDebouncedEffect'
import { TextInput } from '../controls/TextInput/TextInput'
import { Card } from '../controls/Card/Card'

export interface NameProps {
  name: string
  readonly: boolean
  handleSetName?: (name: string) => void
}

export const Name = ({ name, readonly, handleSetName }: NameProps) => {
  const [localName, setLocalName] = useState(name)
  useEffect(() => {
    setLocalName(name)
  }, [name])
  useDebouncedEffect(
    () => handleSetName && handleSetName(localName),
    [localName],
    500,
  )
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    readonly ? () => {} : setLocalName(event.target.value)
  return (
    <Card title="Name:" required={!readonly}>
      {readonly ? (
        <div>{name}</div>
      ) : (
        <TextInput
          id="name"
          value={localName}
          onChange={handleChange}
          placeholder="Your Name"
        />
      )}
    </Card>
  )
}
