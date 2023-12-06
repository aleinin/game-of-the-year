import {
  CSSProperties,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
} from 'react'
import styles from './Button.module.scss'
import classNames from 'classnames'

export enum ButtonType {
  STANDARD,
  ICON,
  TEXT,
}

export interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
  className?: string
  buttonType?: ButtonType
  ref?: MutableRefObject<any>
  ariaLabel?: string
}

const getStyle = (buttonType: ButtonType) => {
  switch (buttonType) {
    case ButtonType.STANDARD:
      return styles.standard
    case ButtonType.ICON:
      return styles.icon
    case ButtonType.TEXT:
      return styles.text
  }
}

export const Button = ({
  onClick,
  disabled = false,
  children,
  className,
  buttonType = ButtonType.STANDARD,
  style,
  ariaLabel,
}: PropsWithChildren<ButtonProps>) => {
  const onClickCallback = useCallback(() => onClick && onClick(), [onClick])
  const buttonClass = classNames(styles.button, getStyle(buttonType), className)
  return (
    <button
      aria-label={ariaLabel}
      tabIndex={0}
      className={buttonClass}
      onClick={onClickCallback}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
