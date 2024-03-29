import { Export } from '../../../icons/export/Export'
import { Button, ButtonType } from '../../controls/Button/Button'
import { downloadCSV } from './downloadCSV'
import fetcher from '../../../api/fetcher'

const getCSV = async (year: number) => {
  const response = await fetch(`${fetcher.getBaseUrl()}/csv?year=${year}`, {
    headers: new Headers({ 'Content-Type': 'text/csv' }),
  })
  return response.text()
}

export interface ExportButtonProps {
  year: number
}
export const ExportButton = ({ year }: ExportButtonProps) => {
  const handleExport = () => {
    getCSV(year).then((csv) => {
      downloadCSV(`goty-${year}-results.csv`, csv)
    })
  }
  return (
    <Button
      buttonType={ButtonType.ICON}
      onClick={handleExport}
      aria-label="Export results to CSV"
    >
      <Export />
    </Button>
  )
}
