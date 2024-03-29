import { Game } from '../../models/game'
import { useProperties } from '../../api/useProperties'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'

export interface BestOldGameProps {
  readonly: boolean
  bestOldGame: Game | null
  handleSetBestOldGame?: (game: Game | null) => void
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const BestOldGame = ({
  bestOldGame,
  handleSetBestOldGame,
  readonly,
}: BestOldGameProps) => {
  const { properties } = useProperties()
  const handleSelect = (bestOldGame: Game | null) => {
    handleSetBestOldGame && handleSetBestOldGame(bestOldGame)
  }
  return (
    <InputStateKeyContext.Provider value={'bestOldGame'}>
      <SingleGame
        title="Best Old Game"
        subtitle={`What is your favorite old game of ${properties.year}?`}
        readonly={readonly}
        game={bestOldGame}
        handleSelect={handleSelect}
        rules={rules(properties.year)}
        placeholder="Select best old game"
      />
    </InputStateKeyContext.Provider>
  )
}
