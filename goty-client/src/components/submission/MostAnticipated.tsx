import React from 'react'
import { useStore } from 'react-redux'
import { createUpdateMostAnticipatedAction } from '../../state/submission/actions'
import { generateRules } from '../../util/generate-rules'
import { SingleGame } from './shared/SingleGame'
import { Game } from '../../models/game'

export interface MostAnticipatedProps {
  readonly: boolean
  mostAnticipated: Game | null
}

const rules: (string | JSX.Element)[] = ['Anything not released']

export const MostAnticipated = (props: MostAnticipatedProps) => {
  const store = useStore()
  const handleSelect = (mostAnticipated: Game | null) => {
    if (!props.readonly) {
      store.dispatch(createUpdateMostAnticipatedAction(mostAnticipated))
    }
  }
  return (
    <SingleGame
      title="Most Anticipated"
      subtitle="What game are you looking forward to most?"
      readonly={props.readonly}
      game={props.mostAnticipated}
      handleSelect={handleSelect}
      content={generateRules(props.readonly, rules)}
    />
  )
}
