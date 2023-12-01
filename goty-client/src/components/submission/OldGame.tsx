import { useStore } from 'react-redux'
import { createUpdateBestOldGameAction } from '../../state/submission/actions'
import { SingleGame } from './shared/SingleGame'
import { Game } from '../../models/game'
import { useProperties } from '../../api/useProperties'

export interface OldGameProps {
  readonly: boolean
  bestOldGame: Game | null
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const OldGame = (props: OldGameProps) => {
  const { properties } = useProperties()
  const store = useStore()
  const handleSelect = (bestOldGame: Game | null) => {
    if (!props.readonly) {
      store.dispatch(createUpdateBestOldGameAction(bestOldGame))
    }
  }
  return (
    <SingleGame
      title="Best Old Game"
      subtitle={`What is your favorite old game of ${properties.year}?`}
      readonly={props.readonly}
      game={props.bestOldGame}
      handleSelect={handleSelect}
      rules={rules(properties.year)}
    />
  )
}
