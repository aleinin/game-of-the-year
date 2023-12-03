import { GOTY } from '../submission/GOTY'
import { BestOldGame } from '../submission/BestOldGame'
import { MostAnticipated } from '../submission/MostAnticipated'
import { Giveaway } from '../submission/Giveaway'
import React from 'react'
import { Name } from '../submission/Name'
import { useSelectedResponse } from './Responses'

export const Response = () => {
  const response = useSelectedResponse()
  return (
    <>
      <Name readonly name={response.name} />
      <GOTY readonly games={response.gamesOfTheYear} />
      <BestOldGame readonly bestOldGame={response.bestOldGame} />
      <MostAnticipated readonly mostAnticipated={response.mostAnticipated} />
      <Giveaway readonly enteredGiveaway={response.enteredGiveaway} />
    </>
  )
}
