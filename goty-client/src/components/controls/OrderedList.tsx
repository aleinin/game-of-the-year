import { motion } from 'framer-motion'
import { Game } from '../../models/game'
import { MoveDirection } from '../submission/GOTY'
import { ListItem } from './ListItem/ListItem'

const spring = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
}

export interface OrderedListProps {
  games: Game[]
  readonly: boolean
  handleDelete: (game: Game) => void
  handleMove: (index: number, direction: MoveDirection) => void
}

export const OrderedList = ({
  games,
  handleDelete,
  handleMove,
  readonly,
}: OrderedListProps) => {
  return (
    <>
      {games.map((game, index) => (
        <motion.div key={game.id} layout transition={spring}>
          <ListItem
            readonly={readonly}
            ordered
            handleDelete={handleDelete}
            handleMove={handleMove}
            game={game}
            currentListLength={games.length}
            index={index}
          />
        </motion.div>
      ))}
    </>
  )
}
