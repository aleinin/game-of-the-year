import { Name } from '../submission/Name/Name'
import { GOTY } from '../submission/GOTY'
import { OldGame } from '../submission/OldGame'
import { MostAnticipated } from '../submission/MostAnticipated'
import { Giveaway } from '../submission/Giveaway'
import React from 'react'
import { usePage } from './usePage'
import { useSubmissions } from '../../api/useSubmissions'

export const Response = () => {
  const page = usePage()
  const { submissions } = useSubmissions()
  const submission = submissions[page - 1]
  return (
    <>
      <Name readonly name={submission.name} />
      <GOTY readonly games={submission.gamesOfTheYear} />
      <OldGame readonly bestOldGame={submission.bestOldGame} />
      <MostAnticipated readonly mostAnticipated={submission.mostAnticipated} />
      <Giveaway readonly enteredGiveaway={submission.enteredGiveaway} />
    </>
  )
}
