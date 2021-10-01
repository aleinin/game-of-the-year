import { TabView, TabPanel } from 'primereact/tabview'
import React, { useEffect, useState } from 'react'
import { ResultsService } from '../../api/resultsService'
import { SubmissionService } from '../../api/submissionService'
import { Submission } from '../../models/submission'
import { Card } from '../Card'
import { Submissions } from './Submissions'
import { Summary } from './Summary'
import { Results } from '../../models/results'

export interface ResultsProps {
  year: number
  lastTime: string
  closeDate: string
  maxListSize: number
}

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
            <Summary
              results={results}
              year={props.year}
              maxListSize={props.maxListSize}
            />
          </TabPanel>
          <TabPanel header="Individual Responses">
            <Submissions
              year={props.year}
              closeDate={props.closeDate}
              lastTime={props.lastTime}
              maxListSize={props.maxListSize}
              submissions={submissions}
            />
          </TabPanel>
        </TabView>
      }
    />
  )
}
