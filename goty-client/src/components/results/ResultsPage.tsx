import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { useDocumentTitle } from '../../util/useDocumentTitle'
import { uppercaseFirstLetter } from '../../util/uppercaseFirstLetter'
import { ResultsControls } from './ResultsControls/ResultsControls'
import { useProperties } from '../../api/useProperties'

export enum Tab {
  SUMMARY = 'summary',
  RESPONSES = 'responses',
}

const tabs = [Tab.SUMMARY, Tab.RESPONSES]

const pathRegex = new RegExp(/\/results\/?/)
const getSelectedTab = (path: string) => {
  if (path.includes(`/${Tab.SUMMARY}`)) {
    return Tab.SUMMARY
  }
  if (path.includes(`/${Tab.RESPONSES}`)) {
    return Tab.RESPONSES
  }
  if (!pathRegex.test(path)) {
    console.warn(`Unknown path: ${path}`)
  }
  return Tab.SUMMARY
}

export const ResultsPage = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const selectedTab = getSelectedTab(pathname)
  const { properties } = useProperties()
  const [selectedYear, setSelectedYear] = useState(properties.year)
  useDocumentTitle(`GOTY - ${uppercaseFirstLetter(selectedTab)}`)
  const handleTabChange = (tab: string) =>
    navigate(`${tab}${tab === Tab.RESPONSES ? '/1' : ''}`)

  return (
    <>
      <ResultsControls
        tabs={tabs}
        handleTabChange={handleTabChange}
        selectedTab={selectedTab}
        handleYearChange={setSelectedYear}
        selectedYear={selectedYear}
      />

      <Outlet context={{ selectedYear }} />
    </>
  )
}

export const useYear = () => {
  return useOutletContext<{ selectedYear: number }>().selectedYear
}
