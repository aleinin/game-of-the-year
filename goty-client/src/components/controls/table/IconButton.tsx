import styled from 'styled-components'
import { CSSProperties, PropsWithChildren, useCallback } from 'react'

const ButtonStyle = styled.button`
  color: white;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  padding: 10px;
  border-radius: 5px;
  background: none;
  display: flex;
  justify-content: center;

  &:hover:not(:disabled) {
    color: purple;
    transition: background-color 200ms linear;
  }

  &:disabled {
    color: gray;
    cursor: inherit;
  }
`

export interface IconButtonProps {
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
}

export const IconButton = ({
  onClick,
  disabled = false,
  style,
  children,
}: PropsWithChildren<IconButtonProps>) => {
  const onClickCallback = useCallback(() => onClick && onClick(), [onClick])
  return (
    <ButtonStyle style={style} onClick={onClickCallback} disabled={disabled}>
      {children}
    </ButtonStyle>
  )
}
