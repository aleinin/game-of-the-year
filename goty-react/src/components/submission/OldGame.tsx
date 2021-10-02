import { useSelector } from 'react-redux'
import { Game } from '../../models/game'
import { selectConstants } from '../../state/constants/selectors'
import { generateRules } from '../../util/generate-rules'
import { SingleGame } from './shared/SingleGame'

export interface OldGameProps {
  readonly: boolean
  bestOldGame: Game | null
  setBestOldGame?: (game: Game | null) => void
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const OldGame = (props: OldGameProps) => {
  const { year } = useSelector(selectConstants)
  const handleSelect = (bestOldGame: Game | null) => {
    if (!props.readonly && props.setBestOldGame != null) {
      props.setBestOldGame(bestOldGame)
    }
  }
  return (
    <SingleGame
      title={`What is your favorite OLD game of ${year}`}
      readonly={props.readonly}
      game={props.bestOldGame}
      handleSelect={handleSelect}
      content={generateRules(props.readonly, rules(year))}
    />
  )
}
