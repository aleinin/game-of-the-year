import { ButtonProps, Button } from 'primereact/button'
import styled from 'styled-components'

export const buttonStyle = `
  .p-button {
    background: #673ab7;
    color: #ffffff;
  }

  .p-button:enabled:hover {
    background: rgba(103, 58, 183, 0.92);
    color: #ffffff;
  }

  .p-button:not(a):not(.p-disabled):focus {
    background: rgba(103, 58, 183, 0.76);
  }
`

const StyleContainer = styled.div`
  ${buttonStyle}
`

export const GotyButton = (props: ButtonProps) => (
  <StyleContainer>
    <Button {...(props as any)} />
  </StyleContainer>
)
