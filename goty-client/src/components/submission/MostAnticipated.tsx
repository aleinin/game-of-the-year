import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'

export interface MostAnticipatedProps {
  readonly: boolean
  mostAnticipated: Game | null
  handleSetMostAnticipated?: (game: Game | null) => void
}

const rules = ['Anything not released']

export const MostAnticipated = ({
  handleSetMostAnticipated,
  mostAnticipated,
  readonly,
}: MostAnticipatedProps) => {
  const handleSelect = (mostAnticipated: Game | null) => {
    handleSetMostAnticipated && handleSetMostAnticipated(mostAnticipated)
  }
  return (
    <InputStateKeyContext.Provider value={'mostAnticipated'}>
      <SingleGame
        id="mostAnticipated"
        title="Most Anticipated"
        subtitle="What game are you looking forward to most?"
        readonly={readonly}
        game={mostAnticipated}
        handleSelect={handleSelect}
        rules={rules}
        placeholder="Select most anticipated game"
      />
    </InputStateKeyContext.Provider>
  )
}
