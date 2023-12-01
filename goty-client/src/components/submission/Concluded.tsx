import { Card } from '../controls/Card/Card'
import { Summary } from '../results/Summary/Summary'
import React from 'react'

export const Concluded = ({ year }: { year: number }) => {
  return (
    <>
      <Card>
        <h2>Game of the Year {year} has concluded</h2>
        <p>Thank you to all who participated</p>
      </Card>
      <Card title="Results" titleFontSize="2em">
        <Summary />
      </Card>
    </>
  )
}
