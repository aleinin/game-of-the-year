import { TextInput } from '../TextInput/TextInput'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { Button } from '../Button/Button'
import {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import styles from './AutoComplete.module.scss'
import { useClickOff } from '../../../util/useClickOff'
import { useDebounce } from '../../../util/useDebounce'

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

  const searchCallback = useCallback(
    (query: string) => {
      setIsLoading(true)
      queryFn &&
        queryFn(query).then(() => {
          setIsLoading(false)
          setIsOpen(true)
        })
    },
    [queryFn],
  )
  const searchNowCallback = useCallback(() => {
    if (value) {
      searchCallback(value)
    }
  }, [value, searchCallback])
  const debouncedSearch = useDebounce(
    (query: string) => searchCallback(query),
    500,
  )
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(event)
    debouncedSearch(event.target.value)
  }
  const handleSelect = (value: T) => {
    setIsOpen(false)
    onSelect && onSelect(value)
  }
  const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && options.length > 0) {
      handleSelect(options[0])
    }
  }
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.comboBox}>
        <TextInput
          style={{ borderRadius: 0 }}
          id={`${id}-text`}
          value={value}
          onChange={handleOnChange}
          placeholder={placeholder}
          isLoading={isLoading}
          onKeyDown={handleKey}
          className={textInputClass}
          onFocus={searchNowCallback}
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
        onClick={searchNowCallback}
        aria-label="Search"
      >
        <ChevronDown />
      </Button>
    </div>
  )
}
