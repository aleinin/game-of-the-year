import React from "react"
import { Game } from "../../../models/game"
import { MoveDirection } from "../GOTY"
import { ListItem } from "./ListItem"

export interface OrderableListProps {
  games: Game[]
  readonly: boolean
  handleDelete: (game: Game) => void
  handleMove: (index: number, direction: MoveDirection) => void
}

export const OrderableList = (props: OrderableListProps) => {
  return (
    <React.Fragment>
      {props.games.map((game, index) => (
        <ListItem
          key={game.id}
          readonly={props.readonly}
          orderable
          handleDelete={props.handleDelete}
          handleMove={props.handleMove}
          game={game}
          currentListLength={props.games.length}
          index={index}
        />
      ))}
    </React.Fragment>
  )
}
