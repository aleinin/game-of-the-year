import { ListItem } from '../ListItem/ListItem'
import { Game } from '../../../models/game'
import styles from './SearchInPlace.module.scss'
import { Search } from '../Search/Search'

export interface SearchInPlaceProps {
  id: string
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  placeholder: string
  searchYears?: number[]
}

const gameIsDefined = (game: Game | null): game is Game => {
  return game != null
}

export const SearchInPlace = ({
  id,
  game,
  handleSelect,
  placeholder,
  readonly,
  searchYears,
}: SearchInPlaceProps) => {
  const handleDelete = () => handleSelect(null)
  if (gameIsDefined(game)) {
    return (
      <ListItem
        readonly={readonly}
        ordered={false}
        game={game}
        handleDelete={handleDelete}
        handleMove={() => {}}
        index={0}
        currentListLength={1}
      />
    )
  }
  if (readonly) {
    return <span className={styles.noSelection}>No selection</span>
  }
  return (
    <Search
      id={id}
      placeholder={placeholder}
      handleSelect={handleSelect}
      searchYears={searchYears}
    />
  )
}
