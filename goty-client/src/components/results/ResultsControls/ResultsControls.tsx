import { ExportButton } from '../ExportButton/ExportButton'
import { TabButtons } from '../../controls/Tabs/Tabs'
import React from 'react'
import { Tab } from '../ResultsPage'
import { Card } from '../../controls/Card/Card'
import styles from './ResultsControls.module.scss'
import { Years } from '../Years'
import { useSubmissionYears } from '../../../api/useSubmissionYears'

interface ResultsControlsProps {
  tabs: Tab[]
  handleTabChange: (tab: string) => void
  selectedYear: number
  handleYearChange: (year: number) => void
  selectedTab: Tab
}

export const ResultsControls = ({
  selectedYear,
  handleYearChange,
  tabs,
  handleTabChange,
  selectedTab,
}: ResultsControlsProps) => {
  const { submissionYears } = useSubmissionYears()
  return (
    <Card style={{ position: 'relative' }}>
      <div className={styles.controls}>
        <div className={styles.yearsDropdown}>
          <Years
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            yearOptions={submissionYears}
          />
        </div>
        <div className={styles.tabsExport}>
          <ExportButton year={selectedYear} />
          <TabButtons
            tabs={tabs}
            onChange={handleTabChange}
            selectedTab={selectedTab}
          />
        </div>
      </div>
    </Card>
  )
}
