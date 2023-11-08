import styled from 'styled-components'
import { Fragment, useCallback } from 'react'

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

const RadioButtons = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-gap: 10px;
`

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
    <RadioButtons>
      {options.map((option) => {
        return (
          <Fragment key={option.id}>
            <input
              disabled={disabled}
              checked={option.value === selectedValue}
              type="radio"
              id={option.id}
              name={name}
              onChange={onChangeCallback(option.value)}
            />
            <label htmlFor={option.id}>{option.label}</label>
          </Fragment>
        )
      })}
    </RadioButtons>
  )
}
