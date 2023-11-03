import React, { useEffect } from 'react'
import { useStore } from 'react-redux'
import {
  useNavigate,
} from 'react-router'
import {Outlet, useLocation} from 'react-router-dom'
import { loadResultsAndSubmissions } from '../../state/results/middleware'
import { capitalizeFirstLetter } from '../../util/capitalize-first-letter'
import { Card } from '../Card'
import { GotyTabView } from '../styled-controls/GotyTabView'
import {TabPanel} from 'primereact/tabview'

export const RouteMap = {
  0: 'summary',
  1: 'responses',
}

export const ResultsComponent = () => {
  const store = useStore()
  useEffect(() => {
    loadResultsAndSubmissions(store)
  }, [store])
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const activeIndex = pathname.includes(`/${RouteMap[0]}`) ? 0 : 1
  useEffect(() => {
    document.title = `TMW GOTY - ${capitalizeFirstLetter(
      RouteMap[activeIndex]
    )}`
  }, [activeIndex])
  const handleRoute = (index: number) => {
    if (index !== 0 && index !== 1) {
      return
    }
    const route = RouteMap[index]
    navigate(`${route}`)
  }
  return (
    <>
      <Card>
        <GotyTabView
          activeIndex={activeIndex}
          onTabChange={(e) => handleRoute(e.index)}
        >
          <TabPanel header="Summary" />
          <TabPanel header="Individual Responses" />
        </GotyTabView>
      </Card>
      <Outlet />
    </>
  )
}
