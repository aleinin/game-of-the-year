import { Game } from '../../models/game'
import { useProperties } from '../../api/useProperties'
import { SingleGame } from '../controls/SingleGame'

export interface BestOldGameProps {
  readonly: boolean
  bestOldGame: Game | null
  handleSetBestOldGame: (game: Game | null) => void
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const BestOldGame = ({
  bestOldGame,
  handleSetBestOldGame,
  readonly,
}: BestOldGameProps) => {
  const { properties } = useProperties()
  const handleSelect = (bestOldGame: Game | null) => {
    if (!readonly) {
      handleSetBestOldGame(bestOldGame)
    }
  }
  return (
    <SingleGame
      title="Best Old Game"
      subtitle={`What is your favorite old game of ${properties.year}?`}
      readonly={readonly}
      game={bestOldGame}
      handleSelect={handleSelect}
      rules={rules(properties.year)}
    />
  )
}
