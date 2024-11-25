import { ExportButton } from '../ExportButton/ExportButton'
import { TabButtons } from '../../controls/Tabs/Tabs'
import { Tab } from '../ResultsPage'
import { Card } from '../../controls/Card/Card'
import styles from './ResultsControls.module.scss'
import { useSubmissionYears } from '../../../api/useSubmissionYears'
import { Dropdown } from '../../controls/Dropdown/Dropdown'

interface ResultsControlsProps {
  tabs: Tab[]
  handleTabChange: (tab: string) => void
  selectedYear: string
  handleYearChange: (year: string) => void
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
        <div className={styles.exportButton}>
          <ExportButton year={selectedYear} />
        </div>
        <div className={styles.tabsExport}>
          <TabButtons
            tabs={tabs}
            onChange={handleTabChange}
            selectedTab={selectedTab}
          />
          <Dropdown
            controlClass={styles.dropdown}
            value={selectedYear}
            onChange={handleYearChange}
            options={submissionYears}
            accessorFn={(num: string) => num}
          />
        </div>
      </div>
    </Card>
  )
}
