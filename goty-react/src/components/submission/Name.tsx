import { Card } from '../Card'
import { InputText } from 'primereact/inputtext'
import styled from 'styled-components'

export interface NameProps {
  name: string
  readonly: boolean
  setName?: (value: string) => void
}

export const NameContainer = styled.div`
  margin-top: 20px;
`

export const Name = ({ name, setName, readonly }: NameProps) => {
  const handleChange = (name: string) => {
    if (!readonly && setName != null) {
      setName(name)
    }
  }
  return (
    <Card
      title="Name:"
      required={true}
      content={
        <NameContainer>
          <InputText
            value={name}
            readOnly={readonly}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Your Name"
          />
        </NameContainer>
      }
    />
  )
}
