import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'
import { Properties } from '../../models/properties'

export interface BestOldGameProps {
  readonly: boolean
  bestOldGame: Game | null
  handleSetBestOldGame?: (game: Game | null) => void
  properties: Properties
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const BestOldGame = ({
  bestOldGame,
  handleSetBestOldGame,
  readonly,
  properties,
}: BestOldGameProps) => {
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
