import styles from './ExportButton.module.scss'
import { Export } from '../../../icons/export/Export'
import { Button } from '../../controls/Button/Button'
import React from 'react'
import { downloadCSV } from './downloadCSV'
import { useSelector } from 'react-redux'
import { selectProperties } from '../../../state/properties/selectors'
import { CSVService } from '../../../api/csvService'

export const ExportButton = () => {
  const properties = useSelector(selectProperties)
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
