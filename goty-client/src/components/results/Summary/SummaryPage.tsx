import { useYear } from '../ResultsPage'
import { Summary } from './Summary'

export const SummaryPage = () => {
  const year = useYear()
  return <Summary year={year} />
}
