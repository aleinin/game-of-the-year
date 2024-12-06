import { useCallback, useState } from 'react'
import styles from './Tabs.module.scss'
import { Button, ButtonType } from '../Button/Button'
import { uppercaseFirstLetter } from '../../../util/uppercaseFirstLetter'
import classNames from 'classnames'

export interface TabButtonsProps {
  tabs: string[]
  selectedTab?: string | null | undefined
  onChange?: (tab: string) => void
}

export const TabButtons = ({
  tabs,
  selectedTab,
  onChange,
}: TabButtonsProps) => {
  const onChangeCallback = useCallback(
    (tab: string) => () => onChange && onChange(tab),
    [onChange],
  )
  const [div, setDiv] = useState<HTMLDivElement | null>(null)
  let width = 0
  let left = 0
  if (div) {
    const startDivLeft = div.children[0].getBoundingClientRect().left
    const newSelected: any = Array.from(div.children).find(
      (element) =>
        element.innerHTML.toLowerCase() === selectedTab?.toLowerCase(),
    )
    if (newSelected) {
      width = newSelected?.offsetWidth ?? 0
      left = newSelected?.getBoundingClientRect()?.left - startDivLeft
    }
  }

  return (
    <div className={styles.tabs} ref={(newDiv) => setDiv(newDiv)}>
      <div id="start-div-placeholder" />
      {tabs.map((tab) => {
        const isSelected = tab === selectedTab
        return (
          <Button
            className={classNames(styles.tabButton, {
              [styles.selected]: isSelected,
            })}
            key={tab}
            onClick={onChangeCallback(tab)}
            buttonType={ButtonType.TEXT}
          >
            {uppercaseFirstLetter(tab)}
          </Button>
        )
      })}
      <div className={styles.bar} style={{ width, left }} />
    </div>
  )
}
