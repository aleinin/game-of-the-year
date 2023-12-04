import {
  ChangeEvent,
  CSSProperties,
  KeyboardEventHandler,
  useCallback,
} from 'react'
import { Spinner } from '../../../icons/spinner/Spinner'
import styles from './TextInput.module.scss'

export interface TextInputProps {
  id: string
  label?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  style?: CSSProperties
  isLoading?: boolean
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
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
}: TextInputProps) => {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange && onChange(event.target.value),
    [onChange],
  )
  return (
    <div className={styles.textContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      {isLoading && <Spinner className={styles.loading} />}
      <input
        className={styles.input}
        style={style}
        disabled={disabled}
        onChange={onChangeCallback}
        value={value}
        id={id}
        placeholder={placeholder}
        name={id}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
