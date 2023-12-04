import { GOTY } from '../submission/GOTY'
import { BestOldGame } from '../submission/BestOldGame'
import { MostAnticipated } from '../submission/MostAnticipated'
import { Giveaway } from '../submission/Giveaway'
import { Name } from '../submission/Name'
import { useSelectedResponse } from './Responses'
import { MostDisappointing } from '../submission/MostDisappointing'
import { useProperties } from '../../api/useProperties'

export const Response = () => {
  const response = useSelectedResponse()
  const { properties } = useProperties()
  return (
    <>
      <Name readonly name={response.name} />
      <GOTY readonly games={response.gamesOfTheYear} />
      <BestOldGame readonly bestOldGame={response.bestOldGame} />
      <MostAnticipated readonly mostAnticipated={response.mostAnticipated} />
      <MostDisappointing
        readonly
        mostDisappointing={response.mostDisappointing}
        year={properties.year}
      />
      <Giveaway readonly enteredGiveaway={response.enteredGiveaway} />
    </>
  )
}
