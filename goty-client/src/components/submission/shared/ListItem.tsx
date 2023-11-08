import styled from 'styled-components'
import { disableColor } from '../../../util/global-styles'
import { indexToOrdinal } from '../../../util/index-to-ordinal'
import { MoveDirection } from '../GOTY'
import { IconButton } from '../../controls/table/IconButton'
import { ChevronUp } from '../../../icons/chevron/ChevronUp'
import { ChevronDown } from '../../../icons/chevron/ChevronDown'
import { Minus } from '../../../icons/minus/Minus'
import { Game } from '../../../models/game'

export interface ListItemProps {
  readonly: boolean
  ordered: boolean
  game: Game
  index: number
  currentListLength: number
  handleDelete: (game: Game) => void
  handleMove: (index: number, direction: MoveDirection) => void
}

const ListItemContainer = styled.div`
  border-radius: 25px;
  padding: 20px;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  vertical-align: center;
  align-items: center;
  background-color: rgb(40, 40, 40);
`

const MarginRight = styled.span`
  margin-right: 5px;
`

const ControlsStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const shared = `
  font-size: 1.2em;
`

const disabledStyle = `
  color: ${disableColor}
`

const enabledReorderStyle = `
color: rgb(103, 58, 183);
&:hover:not(.disabled) {
  text-shadow: 0 0 5px black;
  color: rgba(103, 58, 183, 0.92);
}
cursor: pointer
`

export const ReorderArrow = styled.i<{ disabled: boolean }>`
  ${shared};
  margin-right: 5px;
  ${({ disabled }) => (disabled ? disabledStyle : enabledReorderStyle)}
`

export const RemoveMinus = styled.i`
  ${shared};
  cursor: pointer;
  color: #b00020;
  &:hover {
    text-shadow: 0 0 5px black;
    color: #9a001c;
  }
`

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
    <ListItemContainer>
      <div>
        {ordered ? <MarginRight>{indexToOrdinal(index)}:</MarginRight> : null}
        <MarginRight>{game?.title}</MarginRight>
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
    </ListItemContainer>
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
  <ControlsStyle>
    {ordered && (
      <>
        <IconButton
          disabled={index === 0}
          onClick={() => handleMove(index, MoveDirection.IncreaseRank)}
        >
          <ChevronUp />
        </IconButton>
        <IconButton
          disabled={index === currentListLength - 1}
          onClick={() => handleMove(index, MoveDirection.DecreaseRank)}
        >
          <ChevronDown />
        </IconButton>
      </>
    )}
    <IconButton onClick={() => handleDelete()}>
      <Minus />
    </IconButton>
  </ControlsStyle>
)
