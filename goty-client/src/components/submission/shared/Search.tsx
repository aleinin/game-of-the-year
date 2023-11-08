import { useState } from 'react'
import { GameService } from '../../../api/gameService'
import { GotyAutoComplete } from '../../styled-controls/GotyAutoComplete'
import { Game } from '../../../models/game'

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
    <GotyAutoComplete
      value={input}
      onChange={(e) => setInput(e.target.value)}
      completeMethod={(e) => handleSearch(e.query)}
      onSelect={(e) => handleSelect(e.value)}
      dropdown={true}
      dropdownMode={'current'}
      minLength={1}
      style={{ display: 'flex', justifyContent: 'center' }}
      suggestions={suggestions}
      field="title"
      placeholder={props.placeholder}
    />
  )
}
