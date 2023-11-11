import { ListItem } from '../ListItem/ListItem'
import { Search } from '../../submission/shared/Search'
import { Game } from '../../../models/game'
import styles from './SearchInPlace.module.scss'

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
        ordered={false}
        game={props.game}
        handleDelete={handleDelete}
        handleMove={() => {}}
        index={0}
        currentListLength={1}
      />
    )
  }
  if (props.readonly) {
    return <span className={styles.noSelection}>No selection</span>
  }
  return (
    <Search placeholder={props.placeholder} handleSelect={props.handleSelect} />
  )
}
