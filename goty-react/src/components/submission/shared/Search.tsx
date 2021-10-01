import { Game } from '../../../models/game'
import { AutoComplete } from 'primereact/autocomplete'
import { useState } from 'react'
import { GameService } from '../../../api/gameService'

export interface SearchProps {
  placeholder: string
  year: number
  handleSelect: (game: Game) => void
}

export const Search = (props: SearchProps) => {
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const handleSearch = (searchText: string) =>
    GameService.searchGames(searchText, 10, props.year).then((results) =>
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
