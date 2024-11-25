import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'
import { buildYearsGrammar } from './buildYearsGrammar'

export interface MostDisappointingProps {
  readonly: boolean
  mostDisappointing: Game | null
  handleSetMostDisappointing?: (game: Game | null) => void
  searchYears?: number[]
}

export const MostDisappointing = ({
  handleSetMostDisappointing,
  mostDisappointing,
  readonly,
  searchYears,
}: MostDisappointingProps) => {
  const handleSelect = (mostDisappointing: Game | null) => {
    handleSetMostDisappointing && handleSetMostDisappointing(mostDisappointing)
  }
  return (
    <InputStateKeyContext.Provider value={'mostDisappointing'}>
      <SingleGame
        title="Most Disappointing"
        subtitle="What game didnt live up to your expectations?"
        readonly={readonly}
        game={mostDisappointing}
        handleSelect={handleSelect}
        rules={[
          `Any game${
            searchYears != null
              ? ` released in ${buildYearsGrammar(searchYears)}`
              : ''
          }`,
        ]}
        placeholder="Select most disappointing game"
        searchYears={searchYears}
      />
    </InputStateKeyContext.Provider>
  )
}
