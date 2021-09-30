import { TabView, TabPanel } from 'primereact/tabview'
import React, { useEffect, useState } from 'react'
import { SubmissionService } from '../../api/submissionService'
import { Submission } from '../../models/submission'
import { Card } from '../Card'
import { ResultsTable } from './ResultsTable'
import { Submissions } from './Submissions'
import { Summary } from './Summary'

export interface ResultsProps {
  year: number
  lastTime: string
  closeDate: string
  maxListSize: number
}

const mockRows = [
  {
    points: 0,
    id: 'id',
    rank: 0,
    title: 'Hello',
    votes: 4,
  },
  {
    points: 1,
    id: 'id2',
    rank: 2,
    title: 'Hello2',
    votes: 5,
  },
]

const mockConfig = ['rank', 'title', 'votes', 'points']

export const Results = (props: ResultsProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  useEffect(() => {
    document.title = 'TMW GOTY - Results'
    SubmissionService.getSubmissions().then((subs) => setSubmissions(subs))
  }, [])
  return (
    <Card
      content={
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel header="Summary">
            <Summary mockRows={mockRows} year={props.year} />
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
