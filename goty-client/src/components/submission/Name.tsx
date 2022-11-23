import { Card } from '../Card'
import styled from 'styled-components'
import { useStore } from 'react-redux'
import { createUpdateNameAction } from '../../state/submission/actions'
import { useEffect, useState } from 'react'
import { useDebouncedEffect } from '../../util/use-debounced-effect'
import { GotyInputText } from '../styled-controls/GotyInputText'

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
    500
  )
  const handleChange = (input: string) =>
    readonly ? () => {} : setLocalName(input)
  return (
    <Card title="Name:" required={true}>
      <NameContainer>
        <GotyInputText
          value={readonly ? name : localName}
          readOnly={readonly}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Your Name"
        />
      </NameContainer>
    </Card>
  )
}
