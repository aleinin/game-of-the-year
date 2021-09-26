import { Game } from "../../models/game"
import { generateRules } from "../../util/generate-rules"
import { SingleGame } from "./shared/SingleGame"

export interface OldGameProps {
  year: number
  readonly: boolean
  bestOldGame: Game | null
  setBestOldGame: (game: Game | null) => void
}

const rules = (year: number) => [`Any game released prior to ${year}`]

export const OldGame = (props: OldGameProps) => {
  return (
    <SingleGame
      title={`What is your favorite OLD game of ${props.year}`}
      readonly={props.readonly}
      game={props.bestOldGame}
      handleSelect={props.setBestOldGame}
      content={generateRules(props.readonly, rules(props.year))}
    />
  )
}
