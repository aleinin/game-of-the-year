import { GOTY } from '../submission/GOTY'
import { BestOldGame } from '../submission/BestOldGame'
import { MostAnticipated } from '../submission/MostAnticipated'
import { Giveaway } from '../submission/Giveaway'
import { Name } from '../submission/Name'
import { useSelectedResponse } from './Responses'
import { MostDisappointing } from '../submission/MostDisappointing'
import { useProperties } from '../../api/useProperties'
import { useYear } from './ResultsPage'

export const Response = () => {
  const response = useSelectedResponse()
  const year = useYear()
  const { properties } = useProperties(year)
  return (
    <>
      <Name readonly name={response.name} />
      <GOTY readonly games={response.gamesOfTheYear} properties={properties} />
      <BestOldGame
        readonly
        bestOldGame={response.bestOldGame}
        properties={properties}
      />
      <MostAnticipated readonly mostAnticipated={response.mostAnticipated} />
      <MostDisappointing
        readonly
        mostDisappointing={response.mostDisappointing}
        years={[properties.year]} // todo
      />
      {properties?.hasGiveaway && (
        <Giveaway
          readonly
          enteredGiveaway={response.enteredGiveaway}
          properties={properties}
        />
      )}
    </>
  )
}
