import { TextInput } from '../TextInput/TextInput'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { Button } from '../Button/Button'
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import { useDebouncedEffect } from '../../../util/useDebouncedEffect'
import styles from './AutoComplete.module.scss'
import { useClickOff } from '../../../util/useClickOff'

export interface AutoCompleteProps<T> {
  id: string
  placeholder?: string
  value: string
  queryFn?: (query: string) => Promise<any>
  onChange?: ChangeEventHandler<HTMLInputElement>
  onSelect?: (selected: T) => void
  options: T[]
  accessorFn: (selected: T) => string
  textInputClass?: string
  onBlur?: () => void
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
  textInputClass,
  onBlur,
}: AutoCompleteProps<T>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  useClickOff(ref, () => setIsOpen(false))
  const handleSelect = (value: T) => {
    setIsOpen(false)
    onSelect && onSelect(value)
  }
  const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && options.length > 0) {
      handleSelect(options[0])
    }
  }

  const searchCallback = useCallback(
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
  const handleFocus = () => {
    const searchFn = searchCallback(true)
    searchFn()
  }
  useDebouncedEffect(searchCallback(true), [value], 500)
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
          onKeyDown={handleKey}
          className={textInputClass}
          onFocus={handleFocus}
          onBlur={onBlur}
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
      <Button
        className={styles.dropdownButton}
        onClick={searchCallback(false)}
        aria-label="Search"
      >
        <ChevronDown />
      </Button>
    </div>
  )
}
