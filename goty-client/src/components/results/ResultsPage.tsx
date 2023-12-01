import React from 'react'
import { useNavigate } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { Card } from '../controls/Card/Card'
import { TabButtons } from '../controls/Tabs/Tabs'
import { ExportButton } from './ExportButton/ExportButton'
import { useDocumentTitle } from '../../util/useDocumentTitle'
import { uppercaseFirstLetter } from '../../util/uppercaseFirstLetter'

export enum Tabs {
  SUMMARY = 'summary',
  RESPONSES = 'responses',
}

const tabs = [Tabs.SUMMARY, Tabs.RESPONSES]

const pathRegex = new RegExp(/\/results\/?/)
const getActiveTab = (path: string) => {
  if (path.includes(`/${Tabs.SUMMARY}`)) {
    return Tabs.SUMMARY
  }
  if (path.includes(`/${Tabs.RESPONSES}`)) {
    return Tabs.RESPONSES
  }
  if (!pathRegex.test(path)) {
    console.warn(`Unknown path: ${path}`)
  }
  return Tabs.SUMMARY
}

export const ResultsPage = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = getActiveTab(pathname)
  useDocumentTitle(`GOTY - ${uppercaseFirstLetter(activeTab)}`)
  const handleTabChange = (tab: string) => navigate(`${tab}`)

  return (
    <>
      <Card style={{ position: 'relative' }}>
        <ExportButton />
        <TabButtons
          tabs={tabs}
          onChange={handleTabChange}
          selectedTab={activeTab}
        />
      </Card>
      <Outlet />
    </>
  )
}
