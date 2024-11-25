import { ListItem } from '../ListItem/ListItem'
import { Game } from '../../../models/game'
import styles from './SearchInPlace.module.scss'
import { Search } from '../Search/Search'

export interface SearchInPlaceProps {
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  placeholder: string
  years?: number[]
}

const gameIsDefined = (game: Game | null): game is Game => {
  return game != null
}

export const SearchInPlace = ({
  game,
  handleSelect,
  placeholder,
  readonly,
  years,
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
      placeholder={placeholder}
      handleSelect={handleSelect}
      years={years}
    />
  )
}
