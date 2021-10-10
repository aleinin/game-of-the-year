import { AutoComplete, AutoCompleteProps } from 'primereact/autocomplete'
import styled from 'styled-components'

export const StyleContainer = styled.div`
  button.p-button {
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

export const GotyAutoComplete = (props: AutoCompleteProps) => {
  return (
    <StyleContainer>
      <AutoComplete {...props} inputClassName="goty-input" />
    </StyleContainer>
  )
}
