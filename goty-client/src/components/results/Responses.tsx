import React from 'react'
import { useSelector } from 'react-redux'
import {
  selectIsLoading,
  selectSubmissions,
} from '../../state/results/selectors'
import { Card } from '../controls/Card/Card'
import { Loading } from '../Loading'
import { Paginator } from '../controls/Paginator/Paginator'
import { Outlet, useNavigate } from 'react-router-dom'
import { usePage } from './usePage'

export const Responses = () => {
  const page = usePage()
  const navigate = useNavigate()
  const isLoading = useSelector(selectIsLoading)
  const submissions = useSelector(selectSubmissions)
  const handleSetIndex = (index: number) => {
    const page = index + 1
    navigate(page.toString())
  }
  if (isLoading) {
    return <Loading />
  }
  if (!(submissions?.length > 0)) {
    return (
      <Card>
        <h2>No submissions yet</h2>
      </Card>
    )
  }
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
      <Outlet />
    </>
  )
}
