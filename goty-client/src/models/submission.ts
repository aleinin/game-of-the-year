import { Game, isEqual as gameIsEqual } from './game'

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
    gamesOfTheYearIsEqual(one?.gamesOfTheYear, two?.gamesOfTheYear) &&
    gameIsEqual(one?.bestOldGame, two?.bestOldGame) &&
    gameIsEqual(one?.mostAnticipated, two?.mostAnticipated) &&
    one?.enteredGiveaway === two?.enteredGiveaway
  )
}

const gamesOfTheYearIsEqual = (
  one: Game[] | undefined,
  two: Game[] | undefined,
) => {
  if (one === two) {
    return true
  }
  if (one == null || two == null) {
    return false
  }
  if (one.length !== two.length) {
    return false
  }
  for (let i = 0; i < one.length; i++) {
    if (one[i] !== two[i]) return false
  }
  return true
}
