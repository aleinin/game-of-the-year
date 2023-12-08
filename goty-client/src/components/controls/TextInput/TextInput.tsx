import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
} from 'react'
import { Spinner } from '../../../icons/spinner/Spinner'
import styles from './TextInput.module.scss'
import classNames from 'classnames'

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
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
  onKeyDown,
  className,
  onBlur,
  ...props
}: TextInputProps) => {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange && onChange(event),
    [onChange],
  )
  return (
    <div className={styles.textContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      {isLoading && <Spinner className={styles.loading} />}
      <input
        className={classNames(styles.input, className)}
        style={style}
        disabled={disabled}
        onChange={onChangeCallback}
        value={value}
        id={id}
        placeholder={placeholder}
        name={id}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        {...props}
      />
    </div>
  )
}
