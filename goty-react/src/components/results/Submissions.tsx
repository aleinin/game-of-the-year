import React, { useState } from "react"
import { Submission } from "../../models/submission"
import { Giveaway } from "../submission/Giveaway"
import { GOTY } from "../submission/GOTY"
import { MostAnticipated } from "../submission/MostAnticipated"
import { Name } from "../submission/Name"
import { OldGame } from "../submission/OldGame"
import { Paginator } from "./Paginator"

interface CommonProps {
  year: number
  lastTime: string
  closeDate: string
  maxListSize: number
}

export interface SubmissionsProps extends CommonProps {
  submissions: Submission[]
}

export const Submissions = (props: SubmissionsProps) => {
  const [index, setIndex] = useState(0)
  return (
    <React.Fragment>
      <Paginator
        totalPages={props.submissions.length}
        pageIndex={index}
        setIndex={setIndex}
      />
      <SubmissionResult
        lastTime={props.lastTime}
        year={props.year}
        closeDate={props.closeDate}
        maxListSize={props.maxListSize}
        submission={props.submissions[index]}
      ></SubmissionResult>
    </React.Fragment>
  )
}

export interface SubmissionResultProps extends CommonProps {
  submission: Submission
}

const SubmissionResult = (props: SubmissionResultProps) => {
  return (
    <React.Fragment>
      <Name readonly name={props.submission.name} />
      <GOTY
        readonly
        games={props.submission.gamesOfTheYear}
        year={props.year}
        closeDate={props.closeDate}
        maxListSize={props.maxListSize}
      />
      <OldGame
        readonly
        bestOldGame={props.submission.bestOldGame}
        year={props.year}
      />
      <MostAnticipated
        readonly
        mostAnticipated={props.submission.mostAnticipated}
      />
      <Giveaway
        readonly
        enteredGiveaway={props.submission.enteredGiveaway}
        lastTime={props.lastTime}
      />
    </React.Fragment>
  )
}
