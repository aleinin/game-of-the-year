import styled from 'styled-components'
import { Game } from '../../../api/gameService'
import { disableColor } from '../../../util/global-styles'
import { indexToOrdinal } from '../../../util/index-to-ordinal'
import { MoveDirection } from '../GOTY'

export interface ListItemProps {
  readonly: boolean
  orderable: boolean
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

const Controls = styled.div`
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
  ${shared}
  margin-right: 5px;
  ${({ disabled }) => (disabled ? disabledStyle : enabledReorderStyle)}
`

export const RemoveMinus = styled.i`
  ${shared}
  cursor: pointer;
  color: #b00020;
  &:hover {
    text-shadow: 0 0 5px black;
    color: #9a001c;
  }
`

const getControls = (props: ListItemProps) => {
  if (props.readonly) {
    return null
  }
  const deleteControl = (
    <RemoveMinus
      className="pi pi-minus big-pi"
      onClick={(e) => props.handleDelete(props.game)}
    />
  )
  if (!props.orderable) {
    return <Controls>{deleteControl}</Controls>
  }
  return (
    <Controls>
      <ReorderArrow
        disabled={props.index === 0}
        className="pi pi-chevron-up"
        onClick={() =>
          props.handleMove(props.index, MoveDirection.IncreaseRank)
        }
      />
      <ReorderArrow
        disabled={props.index === props.currentListLength - 1}
        className="pi pi-chevron-down"
        onClick={() =>
          props.handleMove(props.index, MoveDirection.DecreaseRank)
        }
      />
      {deleteControl}
    </Controls>
  )
}

const getTitle = ({ orderable, index, game }: ListItemProps) => {
  return (
    <div>
      {orderable ? <MarginRight>{indexToOrdinal(index)}:</MarginRight> : null}
      <MarginRight>{game?.title}</MarginRight>
    </div>
  )
}

export const ListItem = (props: ListItemProps) => {
  if (!props.game) {
    return null
  }
  return (
    <ListItemContainer>
      {getTitle(props)}
      {getControls(props)}
    </ListItemContainer>
  )
}
