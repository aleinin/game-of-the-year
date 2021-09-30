import { Game } from '../../../models/game'
import {
  AutoComplete,
  AutoCompleteCompleteMethodParams,
} from 'primereact/autocomplete'
import { useState } from 'react'

export interface SearchProps {
  placeholder: string
  handleSelect: (game: Game) => void
}

// TODO
const mockSearch = (
  event: AutoCompleteCompleteMethodParams,
  set: (games: Game[]) => void
) => {
  setTimeout(() => {
    set([
      { id: '1', title: 'Sierra' },
      { id: '2', title: 'Eric' },
      { id: '3', title: 'Kristina' },
      { id: '4', title: 'Andrew' },
      { id: '5', title: 'Patrick' },
      { id: '6', title: 'Ashleigh' },
      { id: '7', title: 'Bryce' },
      { id: '8', title: 'Emmett' },
      { id: '9', title: 'Prairie' },
      { id: '10', title: 'Alex' },
      { id: '11', title: 'Cody' },
      { id: '12', title: 'Aric' },
    ])
  }, 250)
}

export const Search = (props: SearchProps) => {
  const [suggestions, setSuggestions] = useState<Game[]>([])
  return (
    <AutoComplete
      completeMethod={(e) => mockSearch(e, setSuggestions)}
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
