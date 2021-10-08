import { Results } from '../../api/resultsService'
import { Summary } from './Summary'
import { useSelector } from 'react-redux'
import { selectIsLoading, selectResults } from '../../state/results/selectors'
import { Loading } from '../Loading'

export interface ResultsContainerProps {}

const isEmptyResults = (results: Results) =>
  Object.values(results).every((value) => value.length === 0)

export const ResultsContainer = (props: ResultsContainerProps) => {
  const isLoading = useSelector(selectIsLoading)
  const results = useSelector(selectResults)
  if (isLoading) {
    return <Loading />
  }
  if (isEmptyResults(results)) {
    return <h2>No results yet</h2>
  }
  return <Summary results={results} />
}
