import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { localStorageService } from '../api/localStorageService'
import { Card } from './controls/Card/Card'

export const Recovery = () => {
  let [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const secret = searchParams.get('secret')
  if (id && secret) {
    localStorageService.setSubmissionIds(id, secret)
    return <Navigate to="/submission" replace />
  }
  return <Card>Id & secret query params required</Card>
}
