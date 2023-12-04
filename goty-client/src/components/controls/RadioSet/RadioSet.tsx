import { useCallback } from 'react'
import styles from './RadioSet.module.scss'

export interface RadioSetProps<T = any> {
  name: string
  options: RadioOption<T>[]
  disabled?: boolean
  selectedValue?: T | null | undefined
  onChange?: (value: T) => void
}

export interface RadioOption<T = any> {
  id: string
  value: T
  label: string
}

export const RadioSet = <T = any,>({
  name,
  options,
  disabled,
  selectedValue,
  onChange,
}: RadioSetProps<T>) => {
  const onChangeCallback = useCallback(
    (value: any) => () => onChange && onChange(value),
    [onChange],
  )
  return (
    <div className={styles.radio}>
      {options.map((option) => (
        <label key={option.id}>
          <input
            tabIndex={0}
            disabled={disabled}
            checked={option.value === selectedValue}
            type="radio"
            id={option.id}
            name={name}
            onChange={onChangeCallback(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}
