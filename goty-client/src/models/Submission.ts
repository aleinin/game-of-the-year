import { Game, isEqual as gameIsEqual } from './Game'

export interface Submission {
  submissionUUID: string
  name: string
  gamesOfTheYear: Game[]
  bestOldGame: Game | null
  mostAnticipated: Game | null
  enteredGiveaway: boolean | null
}

export const isEqual = (
  one: Submission | null | undefined,
  two: Submission | null | undefined,
): boolean => {
  return (
    one?.submissionUUID === two?.submissionUUID &&
    one?.name === two?.name &&
    one?.gamesOfTheYear?.length === two?.gamesOfTheYear.length &&
    gameIsEqual(one?.bestOldGame, two?.bestOldGame) &&
    gameIsEqual(one?.mostAnticipated, two?.mostAnticipated) &&
    one?.enteredGiveaway === two?.enteredGiveaway
  )
}
