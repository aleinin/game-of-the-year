import { Card } from "../Card"
import { InputText } from "primereact/inputtext"
import styled from "styled-components"

export interface NameProps {
  name: string
  setName: (value: string) => void
}

export const NameContainer = styled.div`
  margin-top: 20px;
`

export const Name = ({ name, setName }: NameProps) => {
  return (
    <Card
      title="Name:"
      required={true}
      content={
        <NameContainer>
          <InputText
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </NameContainer>
      }
    />
  )
}
