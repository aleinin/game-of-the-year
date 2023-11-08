import { motion } from 'framer-motion'
import React from 'react'
import { MoveDirection } from '../GOTY'
import { ListItem } from './ListItem'
import { Game } from '../../../models/game'

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
}

export interface OrderableListProps {
  games: Game[]
  readonly: boolean
  handleDelete: (game: Game) => void
  handleMove: (index: number, direction: MoveDirection) => void
}

export const OrderableList = (props: OrderableListProps) => {
  return (
    <>
      {props.games.map((game, index) => (
        <motion.div key={game.id} layout transition={spring}>
          <ListItem
            readonly={props.readonly}
            ordered
            handleDelete={props.handleDelete}
            handleMove={props.handleMove}
            game={game}
            currentListLength={props.games.length}
            index={index}
          />
        </motion.div>
      ))}
    </>
  )
}
