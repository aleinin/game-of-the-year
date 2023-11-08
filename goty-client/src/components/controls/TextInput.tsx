import styled from 'styled-components'
import { ChangeEvent, CSSProperties, useCallback } from 'react'
import { Spinner } from '../../icons/spinner/Spinner'

const StyledInput = styled.input`
  width: 100%;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid gray;

  &:focus {
    outline: none;
    border-color: purple;
  }
`
const StyledLabel = styled.label``

const TextContainer = styled.div`
  position: relative;
`

export interface TextInputProps {
  id: string
  label?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  style?: CSSProperties
  isLoading?: boolean
}

export const TextInput = ({
  id,
  label,
  value = '',
  placeholder = '',
  onChange,
  disabled = false,
  style,
  isLoading = false,
}: TextInputProps) => {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange && onChange(event.target.value),
    [onChange],
  )
  return (
    <TextContainer>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      {isLoading && (
        <Spinner style={{ position: 'absolute', right: '10px', top: '10px' }} />
      )}
      <StyledInput
        style={style}
        disabled={disabled}
        onChange={onChangeCallback}
        value={value}
        id={id}
        placeholder={placeholder}
        name={id}
      />
    </TextContainer>
  )
}
