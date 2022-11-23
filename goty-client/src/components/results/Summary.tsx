import React from 'react'
import { useSelector } from 'react-redux'
import {
  Results,
  GameResult,
  GameOfTheYearResult,
} from '../../api/resultsService'
import { selectProperties } from '../../state/properties/selectors'
import { ResultsTable } from './ResultsTable'

const gameColumns = ['rank', 'title', 'votes']
const gameOfTheYearColumns = [...gameColumns, 'points']

export interface SummaryProps {
  results: Results
}

export const Summary = ({ results }: SummaryProps) => {
  const { year } = useSelector(selectProperties)
  return (
    <React.Fragment>
      <Respondents rows={results.participants} />
      <GOTYResults rows={results.gamesOfTheYear} />
      <BestOldGameResults rows={results.bestOldGames} year={year} />
      <MostAnticipatedResults rows={results.mostAnticipated} />
      <GiveawayParticipants rows={results.giveawayParticipants} />
    </React.Fragment>
  )
}

interface ResultSummaryProps {
  rows: string[] | GameResult[] | GameOfTheYearResult[]
  year?: number
  maxListSize?: number
}

const buildGetGOTYStyle = (maxListSize?: number): ((row: any) => object) => {
  return (row: any) => {
    const rank = row.rank
    switch (rank) {
      case 1:
        return { 'ranked-first': true }
      case 2:
        return { 'ranked-second': true }
      case 3:
        return { 'ranked-third': true }
      default:
        return { 'ranked-eliminated': rank > (maxListSize ?? 10) }
    }
  }
}

const getGameResultStyle = (row: any): object => {
  const rank = row.rank
  if (rank === 1) {
    return { 'ranked-first': true }
  }
  return { 'ranked-eliminated': true }
}

const Respondents = ({ rows }: ResultSummaryProps) => (
  <ResultsTable
    title="Respondents"
    rows={rows}
    columnConfig={[]}
    rowStyle={() => ({})}
  />
)
const GOTYResults = ({ rows, maxListSize }: ResultSummaryProps) => (
  <ResultsTable
    title="Games of the Year"
    rows={rows}
    columnConfig={gameOfTheYearColumns}
    rowStyle={buildGetGOTYStyle(maxListSize)}
  />
)
const BestOldGameResults = ({ rows, year }: ResultSummaryProps) => (
  <ResultsTable
    title={`Old game of ${year ?? new Date().getFullYear()}`}
    rows={rows}
    columnConfig={gameColumns}
    rowStyle={getGameResultStyle}
  />
)
const MostAnticipatedResults = ({ rows }: ResultSummaryProps) => (
  <ResultsTable
    title="Most Anticipated Game"
    rows={rows}
    columnConfig={gameColumns}
    rowStyle={getGameResultStyle}
  />
)
const GiveawayParticipants = ({ rows }: ResultSummaryProps) => (
  <ResultsTable
    title="Giveaway entries"
    rows={rows}
    columnConfig={[]}
    rowStyle={() => ({})}
  />
)
