import { Button } from "primereact/button"
import React, { useEffect, useState } from "react"
import { Game } from "../../models/game"
import { Submission } from "../../models/submission"
import { Required } from "../../util/global-styles"
import { Card } from "../Card"
import { Giveaway } from "./Giveaway"
import { GOTY } from "./GOTY"
import { MostAnticipated } from "./MostAnticipated"
import { Name } from "./Name"
import { OldGame } from "./OldGame"

export interface SubmissionProps {
  lastTime: string
  year: number
  closeDate: string
  maxListSize: number
}

export const SubmissionPage = (props: SubmissionProps) => {
  const [isValid, setIsValid] = useState(false)
  const [name, setName] = useState("")
  const [gamesOfTheYear, setGamesOfTheYear] = useState<Game[]>([])
  const [bestOldGame, setBestOldGame] = useState<Game | null>(null)
  const [mostAnticipated, setMostAnticipated] = useState<Game | null>(null)
  const [enteredGiveaway, setEnteredGiveaway] = useState<boolean | null>(null)
  const handleSubmit = () => {
    const formSubmission: Submission = {
      submissionUUID: "",
      name,
      gamesOfTheYear,
      mostAnticipated,
      bestOldGame,
      enteredGiveaway,
    }
    console.log("Your submission is:")
    console.log(formSubmission)
  } // todo
  useEffect(() => {
    setIsValid(
      name != null &&
        name.length > 0 &&
        gamesOfTheYear.length > 0 &&
        enteredGiveaway != null
    )
  }, [name, gamesOfTheYear, bestOldGame, mostAnticipated, enteredGiveaway])
  useEffect(() => {
    document.title = "TMW GOTY - Submission"
  }, [])
  return (
    <React.Fragment>
      <Card content={<Required>* Required</Required>} />
      <Name readonly={false} name={name} setName={setName} />
      <GOTY
        games={gamesOfTheYear}
        readonly={false}
        closeDate={props.closeDate}
        year={props.year}
        setGames={setGamesOfTheYear}
        maxListSize={props.maxListSize}
      />
      <OldGame
        year={props.year}
        readonly={false}
        bestOldGame={bestOldGame}
        setBestOldGame={setBestOldGame}
      />
      <MostAnticipated
        readonly={false}
        mostAnticipated={mostAnticipated}
        setMostAnticipated={setMostAnticipated}
      />
      <Giveaway
        readonly={false}
        lastTime={props.lastTime}
        enteredGiveaway={enteredGiveaway}
        setEnteredGiveaway={setEnteredGiveaway}
      />
      <Button
        style={{ width: "100%" }}
        disabled={!isValid}
        label="Submit"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}
