import styles from './ExportButton.module.scss'
import { Export } from '../../../icons/export/Export'
import { Button } from '../../controls/Button/Button'
import React from 'react'
import { downloadCSV } from './downloadCSV'
import { useProperties } from '../../../api/useProperties'
import fetcher from '../../../api/fetcher'

const getCSV = async () => {
  const response = await fetch(`${fetcher.getBaseUrl()}/csv`, {
    headers: new Headers({ 'Content-Type': 'text/csv' }),
  })
  return response.text()
}

export const ExportButton = () => {
  const { properties } = useProperties()
  const handleExport = () => {
    getCSV().then((csv) => {
      downloadCSV(`goty-${properties.year}-results.csv`, csv)
    })
  }
  return (
    <Button isIcon className={styles.exportButton} onClick={handleExport}>
      <Export />
    </Button>
  )
}
