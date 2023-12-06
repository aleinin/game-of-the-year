import { useContext, useState } from 'react'
import { GameService } from '../../api/gameService'
import { Game } from '../../models/game'
import { AutoComplete } from './AutoComplete/AutoComplete'
import {
  InputStateKeyContext,
  SubmissionInputContext,
} from '../submission/useSubmissionForm'

export interface SearchProps {
  placeholder: string
  handleSelect: (game: Game) => void
  year?: number
}

export const Search = (props: SearchProps) => {
  const key = useContext(InputStateKeyContext)
  const {
    [key]: [input, setInput],
  } = useContext(SubmissionInputContext)
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const handleSearch = (searchText: string) =>
    GameService.searchGames({
      title: searchText,
      year: props.year,
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
