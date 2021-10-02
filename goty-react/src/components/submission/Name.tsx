import { Card } from '../Card'
import { InputText } from 'primereact/inputtext'
import styled from 'styled-components'
import { useStore } from 'react-redux'
import { createUpdateNameAction } from '../../state/submission/actions'
import { useState } from 'react'
import { useDebouncedEffect } from '../../util/use-debounced-effect'

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
  useDebouncedEffect(
    () => store.dispatch(createUpdateNameAction(localName)),
    [localName],
    500
  )
  const handleChange = (input: string) =>
    readonly ? () => {} : setLocalName(input)
  /* TODO why does localName not work? */
  return (
    <Card
      title="Name:"
      required={true}
      content={
        <NameContainer>
          <InputText
            value={readonly ? name : localName}
            readOnly={readonly}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Your Name"
          />
        </NameContainer>
      }
    />
  )
}
