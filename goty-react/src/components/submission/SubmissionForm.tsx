import { Button } from 'primereact/button'
import React, { useEffect, useRef, useState } from 'react'
import { Game } from '../../models/game'
import { Submission } from '../../models/submission'
import { Required } from '../../util/global-styles'
import { Card } from '../Card'
import { Giveaway } from './Giveaway'
import { GOTY } from './GOTY'
import { MostAnticipated } from './MostAnticipated'
import { Name } from './Name'
import { OldGame } from './OldGame'
import isEqual from 'lodash.isequal'
import { SubmissionPage } from '../../models/SubmissionPage'
import { SubmissionService } from '../../api/submissionService'

export interface SubmissionFormProps extends SubmissionPage {
  lastTime: string
  year: number
  closeDate: string
  maxListSize: number
  submission: Submission | null
  tiePoints: number[]
}

export const SubmissionForm = (props: SubmissionFormProps) => {
  const initialSubmission = useRef(props.submission)
  const [valid, setValid] = useState(false)
  const [name, setName] = useState(props.submission?.name ?? '')
  const [gamesOfTheYear, setGamesOfTheYear] = useState<Game[]>(
    props.submission?.gamesOfTheYear ?? []
  )
  const [bestOldGame, setBestOldGame] = useState<Game | null>(
    props.submission?.bestOldGame ?? null
  )
  const [mostAnticipated, setMostAnticipated] = useState<Game | null>(
    props.submission?.mostAnticipated ?? null
  )
  const [enteredGiveaway, setEnteredGiveaway] = useState<boolean | null>(
    props.submission?.enteredGiveaway ?? null
  )
  const getSubmission = (): Submission => ({
    submissionUUID: props.submission?.submissionUUID ?? '',
    name,
    gamesOfTheYear,
    mostAnticipated,
    bestOldGame,
    enteredGiveaway,
  })
  const handleSubmit = () => {
    const service =
      props.submission != null
        ? SubmissionService.updateSubmission
        : SubmissionService.createSubmission
    service(getSubmission()).then((success) => {
      if (success) {
        props.setNextStep()
      } else {
        props.setNextStep(false) // todo handle error passthrough
      }
    })
  }
  useEffect(() => {
    if (isEqual(initialSubmission.current, getSubmission())) {
      setValid(false)
    } else {
      setValid(
        name != null &&
          name.length > 0 &&
          gamesOfTheYear.length > 0 &&
          enteredGiveaway != null
      )
    }
  }, [name, gamesOfTheYear, bestOldGame, mostAnticipated, enteredGiveaway])
  useEffect(() => {
    document.title = 'TMW GOTY - Submission'
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
        tiePoints={props.tiePoints}
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
        style={{ width: '100%' }}
        disabled={!valid}
        label="Submit"
        onClick={handleSubmit}
      />
    </React.Fragment>
  )
}
