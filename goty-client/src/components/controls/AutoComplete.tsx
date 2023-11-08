import styled from 'styled-components'
import { TextInput } from './TextInput'
import { ChevronDown } from '../../icons/chevron/ChevronDown'
import { IconButton } from './table/IconButton'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DropdownMenu } from './dropdown/DropdownMenu'
import { useDebouncedEffect } from '../../util/use-debounced-effect'

const AutoCompleteContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 50px;
`

const ComboBoxContainer = styled.div`
  position: relative;
`

export interface AutoCompleteProps<T> {
  id: string
  placeholder?: string
  value: string
  queryFn?: (query: string) => Promise<any>
  onChange?: (value: string) => void
  onSelect?: (selected: T) => void // todo
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
  // todo externalize?
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
    <AutoCompleteContainer ref={ref}>
      <ComboBoxContainer>
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
      </ComboBoxContainer>
      <IconButton
        style={{ background: 'purple', borderRadius: '0px' }}
        onClick={search(false)}
      >
        <ChevronDown />
      </IconButton>
    </AutoCompleteContainer>
  )
}
