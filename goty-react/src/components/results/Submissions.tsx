import React, { useState } from "react"
import { theSubmission } from "../../api/mockData"
import { Giveaway } from "../submission/Giveaway"
import { GOTY } from "../submission/GOTY"
import { MostAnticipated } from "../submission/MostAnticipated"
import { Name } from "../submission/Name"
import { OldGame } from "../submission/OldGame"
import { Paginator } from "./Paginator"

export interface SubmissionsProps {
  year: number
  lastTime: string
  closeDate: string
  maxListSize: number
}

export const Submissions = (props: SubmissionsProps) => {
  const [index, setIndex] = useState(0)
  return (
    <React.Fragment>
      <Paginator totalPages={5} pageIndex={index} setIndex={setIndex} />
      <SubmissionResult {...props}></SubmissionResult>
    </React.Fragment>
  )
}

const SubmissionResult = (props: SubmissionsProps) => {
  return (
    <React.Fragment>
      <Name readonly name={theSubmission.name} />
      <GOTY
        readonly
        games={theSubmission.gamesOfTheYear}
        year={props.year}
        closeDate={props.closeDate}
        maxListSize={props.maxListSize}
      />
      <OldGame
        readonly
        bestOldGame={theSubmission.bestOldGame}
        year={props.year}
      />
      <MostAnticipated
        readonly
        mostAnticipated={theSubmission.mostAnticipated}
      />
      <Giveaway
        readonly
        enteredGiveaway={theSubmission.enteredGiveaway}
        lastTime={props.lastTime}
      />
    </React.Fragment>
  )
}
