import { InputText, InputTextProps } from 'primereact/inputtext'
import styled from 'styled-components'

export const inputTextStyle = `
.p-inputtext:enabled:focus {
  box-shadow: inset 0 0 0 1px #673ab7, inset 0 0 0 1px #673ab7,
    inset 0 0 0 1px #673ab7, inset 0 0 0 1px #673ab7;
}

.p-inputtext:enabled:focus {
  border-color: #673ab7;
}

.p-inputtext {
  width: 100%;
}
`

const StyleContainer = styled.div`
  ${inputTextStyle}
`

export const GotyInputText = (props: InputTextProps) => (
  <StyleContainer>
    <InputText {...(props as any)} />
  </StyleContainer>
)
