import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSubmissions } from '../../api/useSubmissions'

const isValidPage = (page: number, numSubmissions: number) =>
  page >= 1 && page <= numSubmissions

export const usePage = () => {
  const { page: pageParam } = useParams()
  const { submissions } = useSubmissions()
  const navigate = useNavigate()
  const page = parseInt(pageParam ?? '-1')
  useEffect(() => {
    if (
      submissions.length > 0 &&
      (pageParam == null || !isValidPage(page, submissions.length))
    ) {
      navigate('1')
    }
  }, [pageParam, page, submissions, navigate])
  return isValidPage(page, submissions.length) ? page : 0
}
