import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import styled from 'styled-components'
import { buttonStyle } from './GotyButton'
import { inputTextStyle } from './GotyInputText'

const StyledContainer = styled.div`
  display: flex;
  ${inputTextStyle}
  ${buttonStyle}
`
export interface GotyInputWithSubmitButtonProps {
  value: string
  onChange: (e: any) => void
  placeholder: string
  disabled: boolean
  label: string
  onClick: (e: any) => void
  buttonStyle: any
  loading: boolean
}

export const GotyInputWithSubmitButton = (
  props: GotyInputWithSubmitButtonProps
) => {
  return (
    <StyledContainer>
      <InputText
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
      />
      <Button
        disabled={props.disabled}
        label={props.label}
        onClick={props.onClick}
        style={props.buttonStyle}
        loading={props.loading}
      />
    </StyledContainer>
  )
}
