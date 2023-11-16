import styles from '../ResultsPage.module.scss'
import { Export } from '../../../icons/export/Export'
import { Button } from '../../controls/Button/Button'
import React from 'react'
import { downloadCSV } from '../downloadCSV'
import { useSelector } from 'react-redux'
import {
  selectResults,
  selectSubmissions,
} from '../../../state/results/selectors'
import { selectProperties } from '../../../state/properties/selectors'
import { createExportData } from './createExportData'

export const ExportButton = () => {
  const results = useSelector(selectResults)
  const submissions = useSelector(selectSubmissions)
  const properties = useSelector(selectProperties)
  const handleExport = () => {
    downloadCSV(
      `goty-${properties.year}-results.csv`,
      createExportData(results, submissions, properties),
    )
  }
  return (
    <Button isIcon className={styles.exportButton} onClick={handleExport}>
      <Export />
    </Button>
  )
}
