import { useState } from 'react'
import { GameService } from '../../../api/gameService'
import { Game } from '../../../models/game'
import { AutoComplete } from '../../controls/AutoComplete'

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
      id="goty"
      value={input}
      onChange={setInput}
      placeholder={props.placeholder}
      options={suggestions}
      queryFn={(query) => handleSearch(query)}
      onSelect={(value) => handleSelect(value)}
      accessorFn={(game: Game) => game.title}
    />
  )
}
