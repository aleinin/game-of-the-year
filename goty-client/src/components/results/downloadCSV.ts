import { Submission } from '../../models/submission'
import { Properties } from '../../models/properties'
import { indexToOrdinal } from '../../util/index-to-ordinal'

const TEXT_CSV = 'text/csv'
export const downloadCSV = (
  submissions: Submission[],
  properties: Properties,
) => {
  const fileName = `goty-${properties.year}-results.csv`
  const csvString = getCSVData(submissions, properties)
  const blob = new Blob([csvString], {
    type: TEXT_CSV,
  })
  const aTag = document.createElement('a')
  aTag.download = fileName
  aTag.href = window.URL.createObjectURL(blob)
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  aTag.dispatchEvent(clickEvent)
  aTag.remove()
}

const submissionsHeaders = [
  'ID',
  'Name',
  'Best Old Game',
  'Most Anticipated',
  'Entered Giveaway',
]
const propertiesHeaders = 'Properties'

const getCSVData = (
  submissions: Submission[],
  properties: Properties,
): string => {
  // Submissions
  const firstRow = [
    ...submissionsHeaders,
    ...[...Array(properties.maxGamesOfTheYear)].map((_, index) =>
      indexToOrdinal(index),
    ),
  ]
  const rows = []
  rows.push(firstRow)
  submissions.forEach((submission) => {
    const row = []
    row.push(submission.submissionUUID)
    row.push(submission.name)
    row.push(submission.bestOldGame?.title ?? '')
    row.push(submission.mostAnticipated?.title ?? '')
    row.push(submission.enteredGiveaway ? 'Yes' : 'No')
    submission.gamesOfTheYear.forEach((game) => {
      row.push(game.title)
    })
    rows.push(row)
  })
  rows.push([]) // intentional space
  // Properties
  rows.push([propertiesHeaders])
  rows.push(['gotyYear', properties.year])
  rows.push(['deadline', properties.deadline])
  rows.push(['hasGiveaway', properties.hasGiveaway])
  rows.push(['giveawayAmountUSD', properties.giveawayAmountUSD])
  rows.push(['tiePoints', ...properties.tiePoints])
  padRowsWithCorrectNumberOfColumns(rows)
  return rows.map((row) => row.join(',')).join('\n')
}

const padRowsWithCorrectNumberOfColumns = (rows: any[][]) => {
  const numberOfColumns = rows.reduce(
    (mostColumns: number, columns: any[]) =>
      columns.length > mostColumns ? columns.length : mostColumns,
    0,
  )
  rows.forEach((row) => {
    while (row.length < numberOfColumns) {
      row.push('')
    }
  })
}
