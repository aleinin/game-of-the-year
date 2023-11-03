import {RadioButton, RadioButtonChangeEvent} from 'primereact/radiobutton'
import styled from 'styled-components'

export interface RadioOption {
  id: string
  value: any
  label: string
}

export interface GotyRadioSetProps {
  options: RadioOption[]
  disabled: boolean
  name: string
  onChange: (event: RadioButtonChangeEvent) => void
  selectedValue: any
}

const StyleContainer = styled.div`
  .p-radiobutton .p-radiobutton-box.p-highlight {
    border-color: #673ab7;
    background: #ffffff;
  }

  .p-radiobutton .p-radiobutton-box .p-radiobutton-icon {
    background-color: #673ab7;
  }

  .p-radiobutton-disabled {
    cursor: default;
  }

  .p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover {
    background: #ffffff;
  }

  label {
    margin-left: 5px;
  }
`
const OptionSet = styled.div`
  display: flex;
  margin-top: 20px;
`

export const GotyRadioSet = (props: GotyRadioSetProps) => {
  return (
    <StyleContainer>
      {props.options.map((option) => (
        <OptionSet key={option.id}>
          <RadioButton
            inputId={option.id}
            disabled={props.disabled}
            value={option.value}
            name={props.name}
            onChange={props.onChange}
            checked={props.selectedValue === option.value}
          />
          <label htmlFor={option.id}>{option.label}</label>
        </OptionSet>
      ))}
    </StyleContainer>
  )
}
