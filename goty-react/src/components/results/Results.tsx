import { TabView, TabPanel } from 'primereact/tabview'
import { useEffect, useState } from 'react'
import { Submission, SubmissionService } from '../../api/submissionService'
import { Card } from '../Card'
import { ResultsContainer } from './ResultsContainer'
import { Submissions } from './Submissions'

export interface ResultsProps {}

export const ResultsComponent = (props: ResultsProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  // handle null todo
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
            <ResultsContainer />
          </TabPanel>
          <TabPanel header="Individual Responses">
            <Submissions submissions={submissions} />
          </TabPanel>
        </TabView>
      }
    />
  )
}
