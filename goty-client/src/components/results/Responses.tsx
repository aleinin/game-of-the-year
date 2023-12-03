import React from 'react'
import { Card } from '../controls/Card/Card'
import { Paginator } from '../controls/Paginator/Paginator'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import { usePage } from './usePage'
import { useSubmissions } from '../../api/useSubmissions'
import { useYear } from './ResultsPage'
import { Submission } from '../../models/submission'

export const Responses = () => {
  const year = useYear()
  const { submissions } = useSubmissions(year)
  const page = usePage(submissions)
  const navigate = useNavigate()
  const handleSetIndex = (index: number) => {
    const page = index + 1
    navigate(page.toString())
  }
  if (!(submissions?.length > 0)) {
    return (
      <Card>
        <h2>No submissions yet</h2>
      </Card>
    )
  }
  const selectedSubmission = submissions[page - 1]
  return (
    <>
      <Card style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
        <Paginator
          totalPages={submissions.length}
          pageIndex={Math.max(0, page - 1)}
          setIndex={handleSetIndex}
          showTotalPages
        />
      </Card>
      <Outlet context={selectedSubmission} />
    </>
  )
}

export const useSelectedResponse = () => {
  return useOutletContext<Submission>()
}
