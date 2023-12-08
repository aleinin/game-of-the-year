import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from 'react'
import styles from './Button.module.scss'
import classNames from 'classnames'

export enum ButtonType {
  STANDARD,
  ICON,
  TEXT,
}

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  buttonType?: ButtonType
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
  disabled = false,
  children,
  className,
  buttonType = ButtonType.STANDARD,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const buttonClass = classNames(styles.button, getStyle(buttonType), className)
  return (
    <button tabIndex={0} disabled={disabled} className={buttonClass} {...props}>
      {children}
    </button>
  )
}
