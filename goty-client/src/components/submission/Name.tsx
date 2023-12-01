import React, { useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../util/useDebouncedEffect'
import { TextInput } from '../controls/TextInput/TextInput'
import { Card } from '../controls/Card/Card'

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
      <TextInput
        id="name"
        value={readonly ? name : localName}
        disabled={readonly}
        onChange={handleChange}
        placeholder="Your Name"
      />
    </Card>
  )
}
