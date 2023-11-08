import React from 'react'
import { useSelector } from 'react-redux'
import { selectProperties } from '../../state/properties/selectors'
import { ResultsTable } from './ResultsTable'
import { Table } from '../controls/table/Table'
import { Card } from '../Card'
import { Header } from '../controls/table/Table.types'
import { GameOfTheYearResult } from '../../models/gameOfTheYearResult'
import { GameResult } from '../../models/gameResult'
import { Results } from '../../models/results'

const gameColumns = ['rank', 'title', 'votes']
const gameHeaders: Header<GameResult>[] = [
  {
    label: 'Rank',
    accessorFn: (game: GameResult) => game.rank,
    key: 'rank',
  },
  {
    label: 'Title',
    accessorFn: (game: GameResult) => game.title,
    key: 'title',
  },
  {
    label: 'Votes',
    accessorFn: (game: GameResult) => game.votes,
    key: 'votes',
  },
]
const gotyHeaders: Header<GameOfTheYearResult>[] = [
  {
    label: 'Rank',
    accessorFn: (game: GameOfTheYearResult) => game.rank,
    key: 'rank',
  },
  {
    label: 'Title',
    accessorFn: (game: GameOfTheYearResult) => game.title,
    key: 'title',
  },
  {
    label: 'Votes',
    accessorFn: (game: GameOfTheYearResult) => game.votes,
    key: 'votes',
  },
  {
    label: 'Points',
    accessorFn: (game: GameOfTheYearResult) => game.points,
    key: 'points',
  },
]

export interface SummaryProps {
  results: Results
}

export const Summary = ({ results }: SummaryProps) => {
  const { year } = useSelector(selectProperties)
  return (
    <>
      {/*<Respondents rows={results.participants} />*/}
      <GOTYResults rows={results.gamesOfTheYear} />
      <BestOldGameResults rows={results.bestOldGames} year={year} />
      <MostAnticipatedResults rows={results.mostAnticipated} />
      {/*<GiveawayParticipants rows={results.giveawayParticipants} />*/}
    </>
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

// const Respondents = ({ rows }: ResultSummaryProps) => (
//   <ResultsTable
//     title="Respondents"
//     rows={rows}
//     columnConfig={[]}
//     rowStyle={() => ({})}
//   />
// )
const GOTYResults = ({ rows }: { rows: GameOfTheYearResult[] }) => (
  <ResultsTable
    id={'gotyTable'}
    title="Games of the Year"
    rows={rows}
    headers={gotyHeaders}
  />
)
// const gen = () => {
//   const d = []
//   for (let i = 0; i < 26; i++) {
//     d.push({
//       id: i.toString(),
//       rank: i,
//       title: `game ${i + 1}`,
//       votes: 26 - i,
//       points: 100 - i,
//     })
//   }
//   return d
// }

const BestOldGameResults = ({
  rows,
  year,
}: {
  rows: GameResult[]
  year?: number
}) => (
  <ResultsTable
    id={'bestOldGameTable'}
    title={`Old game of ${year ?? new Date().getFullYear()}`}
    rows={rows}
    headers={gameHeaders}
  />
)
const MostAnticipatedResults = ({ rows }: { rows: GameResult[] }) => (
  <ResultsTable
    id="mostAnticipatedGameTable"
    title="Most Anticipated Game"
    rows={rows}
    headers={gameHeaders}
  />
)
// const GiveawayParticipants = ({ rows }: ResultSummaryProps) => (
//   <ResultsTable
//     title="Giveaway entries"
//     rows={rows}
//     columnConfig={[]}
//     rowStyle={() => ({})}
//   />
// )
