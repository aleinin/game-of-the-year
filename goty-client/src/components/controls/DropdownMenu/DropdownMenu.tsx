import { CSSProperties, useCallback } from 'react'
import styles from './DropdownMenu.module.scss'
import classNames from 'classnames'

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
      <div className={styles.menu} aria-expanded="true">
        <div className={styles.noResults}>No options found</div>
      </div>
    ) : (
      <></>
    )
  }

  return (
    <div className={styles.menu} aria-expanded="true" style={style}>
      {options.map((option) => {
        const isSelected = option === selected
        const label = accessorFn(option)
        return (
          <div
            key={label}
            tabIndex={0}
            className={classNames(styles.options, {
              [styles.isSelected]: isSelected,
            })}
            onMouseDown={handleSelectCallback(option)}
            onKeyDown={keyDownHandler(option)}
            role="option"
            aria-selected={isSelected ? 'true' : 'false'}
          >
            {label}
          </div>
        )
      })}
    </div>
  )
}
