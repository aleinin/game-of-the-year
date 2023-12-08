import React from 'react'
import { ResultsTable } from '../ResultsTable/ResultsTable'
import { Header } from '../../controls/Table/Table.types'
import { GameOfTheYearResult } from '../../../models/gameOfTheYearResult'
import { GameResult } from '../../../models/gameResult'
import { Results } from '../../../models/results'
import styles from './Summary.module.scss'
import { Card } from '../../controls/Card/Card'
import { useAnchorScroll } from '../../../util/useAnchorScroll'
import { useResults } from '../../../api/useResults'
import { useYear } from '../ResultsPage'

const stringHeaders: Header<string>[] = [
  {
    label: '',
    accessorFn: (str: string) => str,
    key: '',
  },
]

const gameHeaders: Header<GameResult>[] = [
  {
    label: 'Rank',
    accessorFn: (game: GameResult) => game.rank + 1,
    key: 'rank',
    size: '1fr',
  },
  {
    label: 'Title',
    accessorFn: (game: GameResult) => game.title,
    key: 'title',
    size: '3fr',
  },
  {
    label: 'Votes',
    accessorFn: (game: GameResult) => game.votes,
    key: 'votes',
    size: '1fr',
  },
]
const gotyHeaders: Header<GameOfTheYearResult>[] = [
  {
    label: 'Rank',
    accessorFn: (game: GameOfTheYearResult) => game.rank + 1,
    key: 'rank',
    size: '1fr',
  },
  {
    label: 'Title',
    accessorFn: (game: GameOfTheYearResult) => game.title,
    key: 'title',
    size: '3fr',
  },
  {
    label: 'Votes',
    accessorFn: (game: GameOfTheYearResult) => game.votes,
    key: 'votes',
    size: '1fr',
  },
  {
    label: 'Points',
    accessorFn: (game: GameOfTheYearResult) => game.points,
    key: 'points',
    size: '1fr',
  },
]

const isEmptyResults = (results: Results) =>
  Object.values(results).every((value) => value.length === 0)

export const Summary = () => {
  const year = useYear()
  const { results } = useResults(year)
  useAnchorScroll(results)
  if (isEmptyResults(results)) {
    return (
      <Card>
        <h2>No results yet</h2>
      </Card>
    )
  }
  return (
    <>
      <Respondents rows={results.participants} />
      <GOTYResults rows={results.gamesOfTheYear} />
      <BestOldGameResults rows={results.bestOldGames} />
      <MostAnticipatedResults rows={results.mostAnticipated} />
      <MostDisappointingResults rows={results.mostDisappointing} />
      <GiveawayParticipants rows={results.giveawayParticipants} />
    </>
  )
}

const getGOTYStyle = (row: GameOfTheYearResult): string => {
  const rank = row.rank
  switch (rank) {
    case 0:
      return styles.first
    case 1:
      return styles.second
    case 2:
      return styles.third
    default:
      return rank >= 10 ? styles.eliminated : null
  }
}

const getGameResultStyle = (row: GameResult): string =>
  row.rank === 0 ? styles.first : styles.eliminated

const Respondents = ({ rows }: { rows: string[] }) => (
  <ResultsTable
    id="respondents"
    title="Respondents"
    rows={rows}
    headers={stringHeaders}
  />
)
const GOTYResults = ({ rows }: { rows: GameOfTheYearResult[] }) => (
  <ResultsTable
    id="gamesOfTheYear"
    title="Games of the Year"
    rows={rows}
    headers={gotyHeaders}
    rowStyleFn={getGOTYStyle}
  />
)

const BestOldGameResults = ({ rows }: { rows: GameResult[] }) => (
  <ResultsTable
    id="bestOldGame"
    title="Best Old Game"
    rows={rows}
    headers={gameHeaders}
    rowStyleFn={getGameResultStyle}
  />
)
const MostAnticipatedResults = ({ rows }: { rows: GameResult[] }) => (
  <ResultsTable
    id="mostAnticipated"
    title="Most Anticipated"
    rows={rows}
    headers={gameHeaders}
    rowStyleFn={getGameResultStyle}
  />
)
const MostDisappointingResults = ({ rows }: { rows: GameResult[] }) => (
  <ResultsTable
    id="mostDisappointing"
    title="Most Disappointing"
    rows={rows}
    headers={gameHeaders}
    rowStyleFn={getGameResultStyle}
  />
)
const GiveawayParticipants = ({ rows }: { rows: string[] }) => (
  <ResultsTable
    id="giveaway"
    title="Giveaway entries"
    rows={rows}
    headers={stringHeaders}
  />
)
