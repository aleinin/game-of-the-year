import { TabView, TabPanel } from 'primereact/tabview'
import React, { useEffect, useState } from 'react'
import { Results, ResultsService } from '../../api/resultsService'
import { Submission, SubmissionService } from '../../api/submissionService'
import { Card } from '../Card'
import { Submissions } from './Submissions'
import { Summary } from './Summary'

export interface ResultsProps {}

export const ResultsComponent = (props: ResultsProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  // handle null todo
  const [results, setResults] = useState<Results | null>(null)
  useEffect(() => {
    document.title = 'TMW GOTY - Results'
    SubmissionService.getSubmissions().then((subs) => setSubmissions(subs))
    ResultsService.getResults().then((results) => setResults(results))
  }, [])
  return (
    <Card
      content={
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Summary">
            <Summary results={results} />
          </TabPanel>
          <TabPanel header="Individual Responses">
            <Submissions submissions={submissions} />
          </TabPanel>
        </TabView>
      }
    />
  )
}
