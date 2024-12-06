import { ChangeEvent } from 'react'
import { TextInput } from '../controls/TextInput/TextInput'
import { Card } from '../controls/Card/Card'

export interface NameProps {
  name: string
  readonly: boolean
  handleSetName?: (name: string) => void
}

export const Name = ({ name, readonly, handleSetName }: NameProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleSetName && handleSetName(event.target.value)
  }
  return (
    <Card title="Name:" required={!readonly}>
      {readonly ? (
        <div>{name}</div>
      ) : (
        <TextInput
          id="name"
          value={name}
          onChange={handleChange}
          placeholder="Your Name"
        />
      )}
    </Card>
  )
}
