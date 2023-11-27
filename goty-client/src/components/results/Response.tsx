import { Name } from '../submission/Name/Name'
import { GOTY } from '../submission/GOTY'
import { OldGame } from '../submission/OldGame'
import { MostAnticipated } from '../submission/MostAnticipated'
import { Giveaway } from '../submission/Giveaway'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectSubmissions } from '../../state/results/selectors'
import { usePage } from './usePage'

export const Response = () => {
  const page = usePage()
  const submissions = useSelector(selectSubmissions)
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
