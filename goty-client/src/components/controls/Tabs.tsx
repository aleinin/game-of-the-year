import { useCallback } from 'react'
import styled from 'styled-components'

const TabButtonsStyle = styled.div`
  display: flex;
  border-bottom: 1px solid white;
`

const TabButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-right: 20px;
  margin-bottom: 5px;
`

const SelectedTabButton = styled(TabButton)`
  color: red;
`

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
  return (
    <TabButtonsStyle>
      {tabs.map((tab) =>
        tab === selectedTab ? (
          <SelectedTabButton key={tab} onClick={onChangeCallback(tab)}>
            {tab}
          </SelectedTabButton>
        ) : (
          <TabButton key={tab} onClick={onChangeCallback(tab)}>
            {tab}
          </TabButton>
        ),
      )}
    </TabButtonsStyle>
  )
}
