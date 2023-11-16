import { GameResult } from '../../../models/gameResult'
import { GameOfTheYearResult } from '../../../models/gameOfTheYearResult'
import { Game } from '../../../models/game'
import { Results } from '../../../models/results'
import { Submission } from '../../../models/submission'
import { Properties } from '../../../models/properties'
import { indexToOrdinal } from '../../../util/index-to-ordinal'
import { Column, Section } from '../downloadCSV'

const gameColumns: Column<GameResult>[] = [
  {
    label: 'Rank',
    accessorFn: (game: GameResult) => game.rank + 1,
  },
  {
    label: 'Title',
    accessorKey: 'title',
  },
  {
    label: 'Votes',
    accessorKey: 'votes',
  },
]
const gotyColumns: Column<GameOfTheYearResult>[] = [
  ...gameColumns,
  {
    label: 'Points',
    accessorKey: 'points',
  },
]
const gameAccessor = (game: Game | null) => game?.title ?? ''

const createTextSection = (label: string, data: any[]): Section<any> => ({
  columns: [{ label }],
  data,
})

const createGameSection = (
  title: string,
  data: GameResult[],
): Section<GameResult> => ({
  title,
  columns: gameColumns,
  data,
})

const createGotySection = (
  title: string,
  data: GameOfTheYearResult[],
): Section<GameOfTheYearResult> => ({
  title,
  columns: gotyColumns,
  data,
})

const createPropertiesSection = (
  title: string,
  data: Properties,
): Section<Properties> => ({
  title,
  data,
  columns: [
    {
      label: 'gotyYear',
      accessorKey: 'year',
    },
    {
      label: 'deadline',
      accessorKey: 'deadline',
    },
    {
      label: 'hasGiveaway',
      accessorKey: 'hasGiveaway',
    },
    {
      label: 'giveawayAmountUSD',
      accessorKey: 'giveawayAmountUSD',
    },
  ],
})

const createSubmissionsSection = (
  title: string,
  data: Submission[],
  maxGamesOfTheYear: number,
): Section<Submission> => ({
  title,
  data,
  columns: [
    {
      label: 'ID',
      accessorKey: 'submissionUUID',
    },
    {
      label: 'Name',
      accessorKey: 'name',
    },
    {
      label: 'Best Old Game',
      accessorFn: (submission: Submission) =>
        gameAccessor(submission.bestOldGame),
    },
    {
      label: 'Most Anticipated',
      accessorFn: (submission: Submission) =>
        gameAccessor(submission.mostAnticipated),
    },
    {
      label: 'Entered Giveaway',
      accessorFn: (submission: Submission) =>
        submission.enteredGiveaway ? 'Yes' : 'No',
    },
    ...[...Array(maxGamesOfTheYear)].map((_, index) => ({
      label: indexToOrdinal(index),
      accessorFn: (submission: Submission) =>
        submission.gamesOfTheYear[index]?.title ?? '',
    })),
  ],
})

export const createExportData = (
  results: Results,
  submissions: Submission[],
  properties: Properties,
) => [
  createTextSection('Respondents', results.participants),
  createGotySection('Games of the Year', results.gamesOfTheYear),
  createGameSection('Old Game', results.bestOldGames),
  createGameSection('Most Anticipated', results.mostAnticipated),
  createTextSection('Giveaway Entries', results.giveawayParticipants),
  createSubmissionsSection(
    'Submissions',
    submissions,
    properties.maxGamesOfTheYear,
  ),
  createPropertiesSection('Properties', properties),
  createTextSection('Tie points', properties.tiePoints),
]
