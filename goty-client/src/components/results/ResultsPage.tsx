import React, { useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'
import { useNavigate } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { loadResultsAndSubmissions } from '../../state/results/middleware'
import { Card } from '../controls/Card/Card'
import { TabButtons } from '../controls/Tabs/Tabs'
import { Button } from '../controls/Button/Button'
import styles from './ResultsPage.module.scss'
import { Export } from '../../icons/export/Export'
import { downloadCSV } from './downloadCSV'
import { selectProperties } from '../../state/properties/selectors'
import { selectSubmissions } from '../../state/results/selectors'

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

export const ResultsPage = () => {
  const store = useStore()
  useEffect(() => {
    loadResultsAndSubmissions(store)
  }, [store])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeTab = getActiveTab(pathname)
  const properties = useSelector(selectProperties)
  const submissions = useSelector(selectSubmissions)
  useEffect(() => {
    document.title = `TMW GOTY - ${activeTab}`
  }, [activeTab])
  const handleTabChange = (tab: string) => navigate(`${tab}`)
  const handleExport = () => {
    downloadCSV(submissions, properties)
  }
  return (
    <>
      <Card style={{ position: 'relative' }}>
        <Button isIcon className={styles.exportButton} onClick={handleExport}>
          <Export />
        </Button>
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
