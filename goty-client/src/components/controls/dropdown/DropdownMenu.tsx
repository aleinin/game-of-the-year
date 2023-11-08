import { CSSProperties, useCallback } from 'react'
import { MenuContainer, NoResults, OptionContainer } from './Dropdown.styles'

export interface DropdownMenuProps<T> {
  options: T[]
  selected?: T
  accessorFn: (option: T) => string
  handleSelect?: (newValue: T) => void
  showNoOptions?: boolean
  style?: CSSProperties
}
export const DropdownMenu = <T,>({
  options,
  selected,
  handleSelect,
  accessorFn,
  showNoOptions = true,
  style,
}: DropdownMenuProps<T>) => {
  const handleSelectCallback = useCallback(
    (value: T) => () => handleSelect && handleSelect(value),
    [handleSelect],
  )
  const keyDownHandler = useCallback(
    (value: T) => (event: any) => {
      if (event?.key === 'Enter') {
        handleSelect && handleSelect(value)
      }
    },
    [handleSelect],
  )

  if (!options || options.length === 0) {
    return showNoOptions ? (
      <MenuContainer aria-expanded="true">
        <NoResults>No options found</NoResults>
      </MenuContainer>
    ) : (
      <></>
    )
  }

  return (
    <MenuContainer aria-expanded="true" style={style}>
      {options.map((option) => {
        const isSelected = option === selected
        const label = accessorFn(option)
        return (
          <OptionContainer
            key={label}
            tabIndex={0}
            className={isSelected ? 'is-selected' : ''}
            onMouseDown={handleSelectCallback(option)}
            onKeyDown={keyDownHandler(option)}
            role="option"
            aria-selected={isSelected ? 'true' : 'false'}
          >
            {label}
          </OptionContainer>
        )
      })}
    </MenuContainer>
  )
}
