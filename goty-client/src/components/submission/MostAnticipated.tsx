import React from 'react'
import { Game } from '../../models/game'
import { SingleGame } from '../controls/SingleGame'

export interface MostAnticipatedProps {
  readonly: boolean
  mostAnticipated: Game | null
  handleSetMostAnticipated: (game: Game | null) => void
}

const rules = ['Anything not released']

export const MostAnticipated = ({
  handleSetMostAnticipated,
  mostAnticipated,
  readonly,
}: MostAnticipatedProps) => {
  const handleSelect = (mostAnticipated: Game | null) => {
    if (!readonly) {
      handleSetMostAnticipated(mostAnticipated)
    }
  }
  return (
    <SingleGame
      title="Most Anticipated"
      subtitle="What game are you looking forward to most?"
      readonly={readonly}
      game={mostAnticipated}
      handleSelect={handleSelect}
      rules={rules}
    />
  )
}
