import styled from 'styled-components'
import { Game } from '../../../api/gameService'
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

const getControls = (props: ListItemProps) => {
  if (props.readonly) {
    return null
  }
  const deleteControl = (
    <i
      className="pi pi-minus big-pi"
      onClick={(e) => props.handleDelete(props.game)}
    />
  )
  if (!props.orderable) {
    return <Controls>{deleteControl}</Controls>
  }
  return (
    <Controls>
      <i
        className={`pi pi-chevron-up big-pi ${
          props.index === 0 ? 'disabled' : ''
        }`}
        onClick={() =>
          props.handleMove(props.index, MoveDirection.IncreaseRank)
        }
      />
      <i
        className={`pi pi-chevron-down big-pi ${
          props.index === props.currentListLength - 1 ? 'disabled' : ''
        }`}
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
