import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useAnchorScroll = (...deps: any[]) => {
  const location = useLocation()
  const anchoredElement = useMemo(() => {
    const anchoredId = location.hash?.slice(1) ?? null
    if (anchoredId) {
      return document.getElementById(anchoredId)
    }
    return null
  }, [location, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (anchoredElement) {
      anchoredElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
      })
    }
  }, [anchoredElement])
}
