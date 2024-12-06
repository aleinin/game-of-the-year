import { SearchInPlace } from './SearchInPlace/SearchInPlace'
import { Rules } from '../submission/Rules'
import { Card } from './Card/Card'
import { Game } from '../../models/game'

export interface SingleGameProps {
  id: string
  title: string
  subtitle?: string
  rules: string[]
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  searchYears?: number[]
  placeholder?: string
}

export const SingleGame = ({
  id,
  game,
  handleSelect,
  readonly,
  rules,
  subtitle,
  title,
  searchYears,
  placeholder,
}: SingleGameProps) => {
  return (
    <Card title={title}>
      {subtitle && <span>{subtitle}</span>}
      <Rules readonly={readonly} rules={rules} />
      <SearchInPlace
        id={id}
        readonly={readonly}
        placeholder={placeholder ?? 'Select a game'}
        game={game}
        handleSelect={handleSelect}
        searchYears={searchYears}
      />
    </Card>
  )
}
