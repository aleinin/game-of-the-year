import styled from 'styled-components'
import { Game } from '../../../api/gameService'
import { ListItem } from './ListItem'
import { Search } from './Search'

export interface SearchInPlaceProps {
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  placeholder: string
}

export const NoSelection = styled.span`
  display: block;
  margin-top: 15px;
  font-size: 17px;
`

const gameIsDefined = (game: Game | null): game is Game => {
  return game != null
}

export const SearchInPlace = (props: SearchInPlaceProps) => {
  const handleDelete = () => props.handleSelect(null)
  if (gameIsDefined(props.game)) {
    return (
      <ListItem
        readonly={props.readonly}
        orderable={false}
        game={props.game}
        handleDelete={handleDelete}
        handleMove={() => {}}
        index={0}
        currentListLength={1}
      />
    )
  }
  if (props.readonly) {
    return <NoSelection>No selection</NoSelection>
  }
  return (
    <Search placeholder={props.placeholder} handleSelect={props.handleSelect} />
  )
}
