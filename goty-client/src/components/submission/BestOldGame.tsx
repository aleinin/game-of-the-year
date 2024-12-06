import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'
import { buildYearsGrammar } from './buildYearsGrammar'

export interface BestOldGameProps {
  readonly: boolean
  bestOldGame: Game | null
  handleSetBestOldGame?: (game: Game | null) => void
  year: string
  searchYears?: number[]
}

export const BestOldGame = ({
  bestOldGame,
  handleSetBestOldGame,
  readonly,
  year,
  searchYears,
}: BestOldGameProps) => {
  const handleSelect = (bestOldGame: Game | null) => {
    handleSetBestOldGame && handleSetBestOldGame(bestOldGame)
  }
  return (
    <InputStateKeyContext.Provider value={'bestOldGame'}>
      <SingleGame
        id="bestOldGame"
        title="Best Old Game"
        subtitle={`What is your favorite old game of ${year}?`}
        readonly={readonly}
        game={bestOldGame}
        handleSelect={handleSelect}
        rules={[
          `Any game released${
            searchYears ? ` prior to ${buildYearsGrammar(searchYears)}` : ''
          }`,
        ]}
        placeholder="Select best old game"
      />
    </InputStateKeyContext.Provider>
  )
}
