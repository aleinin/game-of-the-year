import { Card } from '../Card'
import styled from 'styled-components'
import { useStore } from 'react-redux'
import { createUpdateNameAction } from '../../state/submission/actions'
import { useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../util/use-debounced-effect'
import { TextInput } from '../controls/TextInput/TextInput'

export interface NameProps {
  name: string
  readonly: boolean
}

export const NameContainer = styled.div`
  margin-top: 20px;
`

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
      <NameContainer>
        <TextInput
          id="name"
          value={readonly ? name : localName}
          disabled={readonly}
          onChange={handleChange}
          placeholder="Your Name"
        />
      </NameContainer>
    </Card>
  )
}
