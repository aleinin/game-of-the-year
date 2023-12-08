import React from 'react'
import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'

export interface MostDisappointingProps {
  readonly: boolean
  mostDisappointing: Game | null
  handleSetMostDisappointing?: (game: Game | null) => void
  year: number
}

export const MostDisappointing = ({
  handleSetMostDisappointing,
  mostDisappointing,
  readonly,
  year,
}: MostDisappointingProps) => {
  const handleSelect = (mostDisappointing: Game | null) => {
    handleSetMostDisappointing && handleSetMostDisappointing(mostDisappointing)
  }
  return (
    <SingleGame
      title="Most Disappointing"
      subtitle="What game didnt live up to your expectations?"
      readonly={readonly}
      game={mostDisappointing}
      handleSelect={handleSelect}
      rules={[`Any game released in ${year}`]}
      year={year}
    />
  )
}
