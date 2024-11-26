import { Export } from '../../../icons/export/Export'
import { Button, ButtonType } from '../../controls/Button/Button'
import { downloadCSV } from './downloadCSV'
import fetcher from '../../../api/fetcher'

const getCSV = async (year: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const response = await fetch(
    `${fetcher.getBaseUrl()}/csv/${year}?localTimeZone=${timeZone}`,
    {
      headers: new Headers({ 'Content-Type': 'text/csv' }),
    },
  )
  return response.text()
}

export interface ExportButtonProps {
  year: string
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
