import { SearchInPlace } from './SearchInPlace/SearchInPlace'
import { Rules } from '../submission/Rules'
import { Card } from './Card/Card'
import { Game } from '../../models/game'

export interface SingleGameProps {
  title: string
  subtitle?: string
  rules: string[]
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
  year?: number
}

export const SingleGame = ({
  game,
  handleSelect,
  readonly,
  rules,
  subtitle,
  title,
  year,
}: SingleGameProps) => {
  return (
    <Card title={title}>
      {subtitle && <span>{subtitle}</span>}
      <Rules readonly={readonly} rules={rules} />
      <SearchInPlace
        readonly={readonly}
        placeholder="Select a game"
        game={game}
        handleSelect={handleSelect}
        year={year}
      />
    </Card>
  )
}
