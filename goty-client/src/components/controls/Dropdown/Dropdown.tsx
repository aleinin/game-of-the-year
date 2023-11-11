import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import styles from './Dropdown.module.scss'

interface DropdownProps<T = any> {
  value?: T
  options: T[]
  accessorFn: (value: T) => string
  onChange?: (value: T) => void
  placeholder?: string
  width?: string
}

export const Dropdown = <T,>({
  value,
  options,
  onChange,
  placeholder = 'Select a value',
  width,
  accessorFn,
}: DropdownProps<T>) => {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<T | undefined>(value)
  const handleSelect = useCallback(
    (newValue: any) => {
      setSelected(newValue)
      setIsOpen(false)
      if (onChange != null) onChange(newValue)
    },
    [setSelected, setIsOpen, onChange],
  )
  const handleClick = useCallback(() => {
    setIsOpen(!isOpen)
  }, [setIsOpen, isOpen])
  const handleDocumentClick = useCallback(
    (event: any) => {
      if (!event.composedPath().includes(ref.current)) {
        setIsOpen(false)
      }
    },
    [ref, setIsOpen],
  )

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [handleDocumentClick])
  return (
    <div
      className={styles.container}
      ref={ref}
      style={{ width: `${width ?? '100%'}` }}
    >
      <div
        className={styles.control}
        role="button"
        tabIndex={0}
        onMouseDown={handleClick}
        onKeyDown={handleClick}
        aria-haspopup="listbox"
      >
        <div className={styles.value}>
          {selected === undefined ? placeholder : accessorFn(selected)}
          <ChevronDown />
        </div>
      </div>
      {isOpen && (
        <DropdownMenu
          options={options}
          selected={selected}
          handleSelect={handleSelect}
          accessorFn={accessorFn}
        />
      )}
    </div>
  )
}
