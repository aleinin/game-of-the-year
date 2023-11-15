import {
  CSSProperties,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react'
import styles from './Button.module.scss'

export interface ButtonProps {
  onClick?: () => void
  disabled?: boolean
  style?: CSSProperties
  className?: string
  isIcon?: boolean
  ref?: MutableRefObject<any>
}

export const Button = ({
  onClick,
  disabled = false,
  children,
  className,
  isIcon = false,
  style,
}: PropsWithChildren<ButtonProps>) => {
  const onClickCallback = useCallback(() => onClick && onClick(), [onClick])
  const buttonClass = useMemo(
    () =>
      `${styles.button} ${className ? className : ''} ${
        isIcon ? styles.icon : styles.text
      }`,
    [className, isIcon],
  )
  return (
    <button
      className={buttonClass}
      onClick={onClickCallback}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
