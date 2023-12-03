import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Submission } from '../../models/submission'

const isValidPage = (page: number, numSubmissions: number) =>
  page >= 1 && page <= numSubmissions

export const usePage = (submissions: Submission[]) => {
  const { page: pageParam } = useParams()
  const navigate = useNavigate()
  const page = parseInt(pageParam ?? '-1')
  useEffect(() => {
    if (!isValidPage(page, submissions.length)) {
      if (submissions.length > 0) {
        navigate('1')
      } else {
        navigate('')
      }
    }
  }, [pageParam, page, submissions, navigate])
  return isValidPage(page, submissions.length) ? page : 0
}
