import {
  TabPanel,
  TabPanelProps,
  TabView,
  TabViewProps,
} from 'primereact/tabview'
import React from 'react'
import styled from 'styled-components'

export const GotyTabView = (props: React.PropsWithChildren<TabViewProps>) => {
  const StyleContainer = styled.div`
    .p-tabview .p-tabview-nav .p-tabview-ink-bar {
      background-color: #673ab7;
    }

    .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
      color: #673ab7;
    }

    .p-tabview .p-tabview-nav li .p-tabview-nav-link:focus {
      background-color: inherit;
    }
  `
  return (
    <StyleContainer>
      <TabView {...props} />
    </StyleContainer>
  )
}

export const GotyTabPanel = (props: TabPanelProps) => {
  return <TabPanel {...props} />
}
