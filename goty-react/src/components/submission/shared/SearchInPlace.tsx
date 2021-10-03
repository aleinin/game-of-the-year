import { Game } from '../../../api/gameService'
import { ListItem } from './ListItem'
import { Search } from './Search'

export interface SearchInPlaceProps {
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  placeholder: string
}

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
  return (
    <Search placeholder={props.placeholder} handleSelect={props.handleSelect} />
  )
}
