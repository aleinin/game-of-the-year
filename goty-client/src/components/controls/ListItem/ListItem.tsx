import { indexToOrdinal } from '../../../util/index-to-ordinal'
import { MoveDirection } from '../../submission/GOTY'
import { Button } from '../Button/Button'
import { ChevronUp } from '../../../icons/chevron/ChevronUp'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { Minus } from '../../../icons/minus/Minus'
import { Game } from '../../../models/game'
import styles from './ListItem.module.scss'

export interface ListItemProps {
  readonly: boolean
  ordered: boolean
  game: Game
  index: number
  currentListLength: number
  handleDelete: (game: Game) => void
  handleMove: (index: number, direction: MoveDirection) => void
}

export const ListItem = ({
  index,
  handleMove,
  handleDelete,
  ordered,
  currentListLength,
  readonly,
  game,
}: ListItemProps) => {
  if (!game) {
    return null
  }
  return (
    <div className={styles.container}>
      <div>
        {ordered ? (
          <span className={styles.marginRight5}>{indexToOrdinal(index)}:</span>
        ) : null}
        <span className={styles.marginRight5}>{game?.title}</span>
      </div>
      {!readonly && (
        <Controls
          index={index}
          handleMove={handleMove}
          handleDelete={() => handleDelete(game)}
          ordered={ordered}
          currentListLength={currentListLength}
        />
      )}
    </div>
  )
}

interface ControlsProps {
  index: number
  handleMove: (index: number, direction: MoveDirection) => void
  handleDelete: () => void
  ordered: boolean
  currentListLength: number
}
const Controls = ({
  index,
  handleMove,
  handleDelete,
  ordered,
  currentListLength,
}: ControlsProps) => (
  <div className={styles.controls}>
    {ordered && (
      <>
        <Button
          isIcon={true}
          disabled={index === 0}
          onClick={() => handleMove(index, MoveDirection.IncreaseRank)}
        >
          <ChevronUp />
        </Button>
        <Button
          isIcon={true}
          disabled={index === currentListLength - 1}
          onClick={() => handleMove(index, MoveDirection.DecreaseRank)}
        >
          <ChevronDown />
        </Button>
      </>
    )}
    <Button
      isIcon={true}
      className={styles.deleteButton}
      onClick={() => handleDelete()}
    >
      <Minus />
    </Button>
  </div>
)
