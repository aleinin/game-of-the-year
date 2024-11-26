import { Card } from '../controls/Card/Card'
import { Summary } from '../results/Summary/Summary'

export const Concluded = ({ year }: { year: string }) => {
  return (
    <>
      <Card>
        <h2>Game of the Year {year} has concluded</h2>
        <p>Thank you to all who participated</p>
      </Card>
      <Card title="Results" titleFontSize="2em">
        <Summary year={year} />
      </Card>
    </>
  )
}
