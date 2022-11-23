import React, { useEffect } from 'react'
import { useStore } from 'react-redux'
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router'
import { loadResultsAndSubmissions } from '../../state/results/middleware'
import { capitalizeFirstLetter } from '../../util/capitalize-first-letter'
import { Card } from '../Card'
import { GotyTabPanel, GotyTabView } from '../styled-controls/GotyTabView'
import { ResultsContainer } from './ResultsContainer'
import { Submissions } from './Submissions'

export const RouteMap = {
  0: 'summary',
  1: 'responses',
}

export interface ResultsProps {}

export const ResultsComponent = (props: ResultsProps) => {
  const { path } = useRouteMatch()
  const store = useStore()
  useEffect(() => {
    loadResultsAndSubmissions(store)
  }, [store])
  const history = useHistory()
  const activeIndex = history.location.pathname.startsWith(
    `${path}/${RouteMap[0]}`
  )
    ? 0
    : 1
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
    history.push(`${path}/${route}`)
  }
  return (
    <React.Fragment>
      <Card>
        <GotyTabView
          activeIndex={activeIndex}
          onTabChange={(e) => handleRoute(e.index)}
        >
          <GotyTabPanel header="Summary" />
          <GotyTabPanel header="Individual Responses" />
        </GotyTabView>
      </Card>
      <Switch>
        <Route path={`${path}/${RouteMap[0]}`}>
          <ResultsContainer />
        </Route>
        <Route path={`${path}/${RouteMap[1]}`}>
          <Submissions />
        </Route>
        <Redirect exact from={path} to={`${path}/${RouteMap[0]}`} />
      </Switch>
    </React.Fragment>
  )
}
