import React, { useEffect } from 'react'
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { loadResultsAndSubmissions } from '../../state/results/middleware'
import { Card } from '../Card'
import { TabButtons } from '../controls/Tabs'

export enum Tabs {
  SUMMARY = 'Summary',
  RESPONSES = 'Responses',
}

const tabs = [Tabs.SUMMARY, Tabs.RESPONSES]

const getActiveTab = (path: string) => {
  if (path.includes(`/${Tabs.SUMMARY}`)) {
    return Tabs.SUMMARY
  }
  if (path.includes(`/${Tabs.RESPONSES}`)) {
    return Tabs.RESPONSES
  }
  console.warn(`Unknown path: ${path}`)
  return Tabs.SUMMARY
}

export const ResultsComponent = () => {
  const store = useStore()
  useEffect(() => {
    loadResultsAndSubmissions(store)
  }, [store])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = getActiveTab(pathname)
  useEffect(() => {
    document.title = `TMW GOTY - ${activeTab}`
  }, [activeTab])
  const handleTabChange = (tab: string) => navigate(`${tab}`)
  return (
    <>
      <Card>
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
