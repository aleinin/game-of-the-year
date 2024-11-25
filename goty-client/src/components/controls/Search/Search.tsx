import { useContext, useEffect, useState } from 'react'
import { Game } from '../../../models/game'
import {
  InputStateKeyContext,
  SubmissionInputContext,
} from '../../submission/useSubmissionForm'
import { GameService } from '../../../api/gameService'
import { AutoComplete } from '../AutoComplete/AutoComplete'
import styles from './Search.module.scss'
import classNames from 'classnames'

export interface SearchProps {
  placeholder: string
  handleSelect: (game: Game) => void
  years?: number[]
}

const errorMessage =
  'Incomplete selection. Select a game from the list or leave blank'

export const Search = (props: SearchProps) => {
  const key = useContext(InputStateKeyContext)
  const {
    [key]: [input, setInput],
  } = useContext(SubmissionInputContext)
  const [hasError, setHasError] = useState(false)
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const handleSearch = (searchText: string) =>
    GameService.searchGames({
      title: searchText,
      years: props.years,
    }).then((results) => setSuggestions(results))
  const handleSelect = (game: Game) => {
    setInput('')
    props.handleSelect(game)
  }
  const handleOnBlur = () => {
    setHasError(input !== '')
  }
  useEffect(() => {
    if (input === '' && hasError) {
      setHasError(false)
    }
  }, [input, hasError])
  return (
    <div>
      <div className={styles.error}>{hasError && errorMessage}</div>
      <AutoComplete
        id="goty"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={props.placeholder}
        options={suggestions}
        queryFn={(query) => handleSearch(query)}
        onSelect={(value) => handleSelect(value)}
        accessorFn={(game: Game) => game.title}
        textInputClass={classNames({ [styles.textInputError]: hasError })}
        onBlur={handleOnBlur}
      />
    </div>
  )
}
