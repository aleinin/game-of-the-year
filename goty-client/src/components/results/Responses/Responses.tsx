import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectIsLoading,
  selectSubmissions,
} from '../../../state/results/selectors'
import { Card } from '../../controls/Card/Card'
import { Loading } from '../../Loading'
import { Giveaway } from '../../submission/Giveaway'
import { GOTY } from '../../submission/GOTY'
import { MostAnticipated } from '../../submission/MostAnticipated'
import { Name } from '../../submission/Name/Name'
import { OldGame } from '../../submission/OldGame'
import { Paginator } from '../../controls/Paginator/Paginator'
import { Submission } from '../../../models/submission'

export const Responses = () => {
  const [index, setIndex] = useState(0)
  const isLoading = useSelector(selectIsLoading)
  const submissions = useSelector(selectSubmissions)
  if (isLoading) {
    return <Loading />
  }
  if (!(submissions?.length > 0)) {
    return (
      <Card>
        <h2>No submissions yet</h2>
      </Card>
    )
  }
  return (
    <>
      <Card style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
        <Paginator
          totalPages={submissions.length}
          pageIndex={index}
          setIndex={setIndex}
          showTotalPages
        />
      </Card>
      <Response submission={submissions[index]}></Response>
    </>
  )
}

export interface SubmissionResultProps {
  submission: Submission
}

const Response = ({ submission }: SubmissionResultProps) => {
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
