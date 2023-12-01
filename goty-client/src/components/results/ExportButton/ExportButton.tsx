import styles from './ExportButton.module.scss'
import { Export } from '../../../icons/export/Export'
import { Button } from '../../controls/Button/Button'
import React from 'react'
import { downloadCSV } from './downloadCSV'
import { CSVService } from '../../../api/csvService'
import { useProperties } from '../../../api/useProperties'

export const ExportButton = () => {
  const { properties } = useProperties()
  const handleExport = () => {
    CSVService.getCSV().then((csv) => {
      downloadCSV(`goty-${properties.year}-results.csv`, csv)
    })
  }
  return (
    <Button isIcon className={styles.exportButton} onClick={handleExport}>
      <Export />
    </Button>
  )
}
