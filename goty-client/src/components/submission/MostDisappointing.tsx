import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'
import { InputStateKeyContext } from './useSubmissionForm'

export interface MostDisappointingProps {
  readonly: boolean
  mostDisappointing: Game | null
  handleSetMostDisappointing?: (game: Game | null) => void
  years: number[]
}

const buildYearsGrammar = (years: number[]): string => {
  if (years.length === 0) {
    console.error('empty years when trying to build years grammar')
    return ''
  }
  const sortedYears = [...years].sort((a, b) => a - b)
  if (sortedYears.length === 1) {
    return `${sortedYears[0]}`
  } else if (sortedYears.length === 2) {
    return `${sortedYears[0]} or ${sortedYears[1]}`
  } else {
    const lastYear = sortedYears.pop()
    return `${sortedYears.join(', ')}, or ${lastYear}`
  }
}

export const MostDisappointing = ({
  handleSetMostDisappointing,
  mostDisappointing,
  readonly,
  years,
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
        rules={[`Any game released in ${buildYearsGrammar(years)}`]}
        placeholder="Select most disappointing game"
        years={years}
      />
    </InputStateKeyContext.Provider>
  )
}
