import React from "react"
import { Game } from "../../../models/game"
import { Card } from "../../Card"
import { SearchInPlace } from "./SearchInPlace"

export interface SingleGameProps {
  title: string
  content: JSX.Element
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
}

export const SingleGame = (props: SingleGameProps) => {
  return (
    <Card
      title={props.title}
      content={
        <React.Fragment>
          {props.content}
          <SearchInPlace
            readonly={props.readonly}
            placeholder="Select a game"
            game={props.game}
            handleSelect={props.handleSelect}
          />
        </React.Fragment>
      }
    ></Card>
  )
}
