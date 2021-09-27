import React from "react"
import { Game } from "../../models/game"
import { generateRules } from "../../util/generate-rules"
import { SingleGame } from "./shared/SingleGame"

export interface MostAnticipatedProps {
  readonly: boolean
  mostAnticipated: Game | null
  setMostAnticipated?: (game: Game | null) => void
}

const rules: (string | JSX.Element)[] = ["Anything not released"]

export const MostAnticipated = (props: MostAnticipatedProps) => {
  const handleSelect = (mostAnticipated: Game | null) => {
    if (!props.readonly && props.setMostAnticipated != null) {
      props.setMostAnticipated(mostAnticipated)
    }
  }
  return (
    <SingleGame
      title="What game are you looking forward to most?"
      readonly={props.readonly}
      game={props.mostAnticipated}
      handleSelect={handleSelect}
      content={generateRules(props.readonly, rules)}
    />
  )
}
