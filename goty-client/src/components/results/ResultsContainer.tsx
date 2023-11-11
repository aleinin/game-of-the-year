import { Summary } from './Summary/Summary'
import { useSelector } from 'react-redux'
import { selectIsLoading, selectResults } from '../../state/results/selectors'
import { Loading } from '../Loading'
import { Card } from '../controls/Card/Card'
import { Results } from '../../models/results'

const isEmptyResults = (results: Results) =>
  Object.values(results).every((value) => value.length === 0)

export const ResultsContainer = () => {
  const isLoading = useSelector(selectIsLoading)
  const results = useSelector(selectResults)
  if (isLoading) {
    return <Loading />
  }
  if (isEmptyResults(results)) {
    return (
      <Card>
        <h2>No results yet</h2>
      </Card>
    )
  }
  return <Summary results={results} />
}
