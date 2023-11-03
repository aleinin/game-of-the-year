import {
  TabView,
  TabViewProps,
} from 'primereact/tabview'
import React from 'react'
import styled from 'styled-components'

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
export const GotyTabView = (props: React.PropsWithChildren<TabViewProps>) =>
    <StyleContainer>
      <TabView {...props} />
    </StyleContainer>