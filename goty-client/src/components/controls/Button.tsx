import styled from 'styled-components'
import { CSSProperties, useCallback } from 'react'

const ButtonStyle = styled.button`
  color: inherit;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  background-color: purple;
  padding: 10px;
  border-radius: 5px;

  &:hover:not(:disabled) {
    background-color: mediumpurple;
    transition: background-color 200ms linear;
  }

  &:active:not(:disabled) {
    position: relative;
    top: 1px;
  }

  &:disabled {
    color: gray;
    background-color: #383838;
    cursor: inherit;
  }
`

export interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  style?: CSSProperties
}

export const Button = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const onClickCallback = useCallback(() => onClick && onClick(), [onClick])
  return (
    <ButtonStyle
      style={style}
      onClick={onClickCallback}
      disabled={disabled || loading}
    >
      {label}
    </ButtonStyle>
  )
}
