import { useEffect, useState } from 'react'
import { Results, ResultsService } from '../../api/resultsService'
import { Summary } from './Summary'
import { ProgressSpinner } from 'primereact/progressspinner'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
`

export const ResultsContainer = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Results | null>(null)
  useEffect(() => {
    setIsLoading(true)
    ResultsService.getResults().then((results) => {
      setIsLoading(false)
      return setResults(results)
    })
  }, [])
  if (isLoading) {
    return (
      <LoadingContainer>
        <ProgressSpinner />
      </LoadingContainer>
    )
  }
  return <Summary results={results} />
}
