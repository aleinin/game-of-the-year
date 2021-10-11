import { AutoComplete } from 'primereact/autocomplete'
import { useState } from 'react'
import { Game, GameService } from '../../../api/gameService'

export interface SearchProps {
  placeholder: string
  handleSelect: (game: Game) => void
  year?: number
}

export const Search = (props: SearchProps) => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const handleSearch = (searchText: string) =>
    GameService.searchGames({
      title: searchText,
      ...(props.year && { year: props.year }),
    }).then((results) => setSuggestions(results))
  const handleSelect = (game: Game) => {
    setInput('')
    props.handleSelect(game)
  }
  return (
    <AutoComplete
      value={input}
      onChange={(e) => setInput(e.target.value)}
      completeMethod={(e) => handleSearch(e.query)}
      onSelect={(e) => handleSelect(e.value)}
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
