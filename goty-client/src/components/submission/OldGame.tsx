import { useSelector, useStore } from 'react-redux'
import { Game } from '../../api/gameService'
import { selectConstants } from '../../state/constants/selectors'
import { createUpdateBestOldGameAction } from '../../state/submission/actions'
import { generateRules } from '../../util/generate-rules'
import { SingleGame } from './shared/SingleGame'

export interface OldGameProps {
  readonly: boolean
  bestOldGame: Game | null
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const OldGame = (props: OldGameProps) => {
  const { year } = useSelector(selectConstants)
  const store = useStore()
  const handleSelect = (bestOldGame: Game | null) => {
    if (!props.readonly) {
      store.dispatch(createUpdateBestOldGameAction(bestOldGame))
    }
  }
  return (
    <SingleGame
      title={`What is your favorite OLD game of ${year}`}
      readonly={props.readonly}
      game={props.bestOldGame}
      handleSelect={handleSelect}
      content={generateRules(props.readonly, rules(year))}
    />
  )
}
