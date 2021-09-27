import React from "react"
import { ResultsTable } from "./ResultsTable"

export const Summary = ({
  mockRows,
  year,
}: {
  mockRows: any[]
  year: number
}) => (
  <React.Fragment>
    <Respondents rows={mockRows} />
    <GOTYResults rows={mockRows} />
    <BestOldGameResults rows={mockRows} year={year} />
    <MostAnticipatedResults rows={mockRows} />
    <GiveawayEntries rows={mockRows} />
  </React.Fragment>
)

const Respondents = ({ rows }: { rows: any[] }) => (
  <ResultsTable title="Respondents" rows={rows} />
)
const GOTYResults = ({ rows }: { rows: any[] }) => (
  <ResultsTable title="Games of the Year" rows={rows} />
)
const BestOldGameResults = ({ rows, year }: { rows: any[]; year: number }) => (
  <ResultsTable title={`Old game of ${year}`} rows={rows} />
)
const MostAnticipatedResults = ({ rows }: { rows: any[] }) => (
  <ResultsTable title="Most Anticipated Game" rows={rows} />
)
const GiveawayEntries = ({ rows }: { rows: any[] }) => (
  <ResultsTable title="Giveaway entries" rows={rows} />
)
