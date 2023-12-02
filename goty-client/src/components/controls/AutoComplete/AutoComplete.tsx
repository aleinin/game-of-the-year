import { TextInput } from '../TextInput/TextInput'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { Button } from '../Button/Button'
import { useCallback, useRef, useState } from 'react'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import { useDebouncedEffect } from '../../../util/useDebouncedEffect'
import styles from './AutoComplete.module.scss'
import { useClickOff } from '../../../util/useClickOff'

export interface AutoCompleteProps<T> {
  id: string
  placeholder?: string
  value: string
  queryFn?: (query: string) => Promise<any>
  onChange?: (value: string) => void
  onSelect?: (selected: T) => void
  options: T[]
  accessorFn: (selected: T) => string
}

export const AutoComplete = <T = any,>({
  id,
  value,
  onChange,
  placeholder,
  queryFn,
  onSelect,
  options,
  accessorFn,
}: AutoCompleteProps<T>) => {
  const ref = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  useClickOff(ref, () => setIsOpen(false))
  const handleSelect = (value: T) => {
    setIsOpen(false)
    onSelect && onSelect(value)
  }
  const search = useCallback(
    (requireValue: boolean) => () => {
      if (queryFn && (value || !requireValue)) {
        setIsLoading(true)
        queryFn(value).then(() => {
          setIsLoading(false)
          setIsOpen(true)
        })
      }
    },
    [value, queryFn],
  )
  useDebouncedEffect(search(true), [value], 500)
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.comboBox}>
        <TextInput
          style={{ borderRadius: 0 }}
          id={`${id}-text`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isLoading={isLoading}
        />
        {isOpen && (
          <DropdownMenu
            style={{ maxHeight: '200px', overflow: 'auto' }}
            options={options}
            handleSelect={handleSelect}
            accessorFn={accessorFn}
            showNoOptions={false}
          />
        )}
      </div>
      <Button className={styles.dropdownButton} onClick={search(false)}>
        <ChevronDown />
      </Button>
    </div>
  )
}
