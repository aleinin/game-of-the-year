import { AutoComplete } from 'primereact/autocomplete'
import { useState } from 'react'
import { Game, GameService } from '../../../api/gameService'
import { useSelector } from 'react-redux'
import { selectConstants } from '../../../state/constants/selectors'

export interface SearchProps {
  placeholder: string
  handleSelect: (game: Game) => void
}

export const Search = (props: SearchProps) => {
  const { year } = useSelector(selectConstants)
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const handleSearch = (searchText: string) =>
    GameService.searchGames(searchText, 10, year).then((results) =>
      setSuggestions(results)
    )
  return (
    <AutoComplete
      completeMethod={(e) => handleSearch(e.query)}
      onSelect={(e) => props.handleSelect(e.value)}
      dropdown={true}
      inputStyle={{ width: '100%' }}
      minLength={1}
      style={{ display: 'flex', justifyContent: 'center' }}
      suggestions={suggestions}
      field="title"
      placeholder={props.placeholder}
    />
  )
}
