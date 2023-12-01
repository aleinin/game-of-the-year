import { Submission } from '../../models/submission'
import { Game } from '../../models/game'

export const SET = 'SET'
export const UPDATE_FORM = 'UPDATE_FORM'
export const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS'

export const createSubmitSuccessAction = (submission: Submission) => ({
  type: SUBMIT_SUCCESS,
  payload: submission,
})

export const createSetSubmissionAction = (submission: Submission) => ({
  type: SET,
  payload: submission,
})

export const createUpdateNameAction = (name: string) => ({
  type: UPDATE_FORM,
  payload: { key: 'name', value: name },
})

export const createUpdateGamesOfTheYearAction = (gamesOfTheYear: Game[]) => ({
  type: UPDATE_FORM,
  payload: { key: 'gamesOfTheYear', value: gamesOfTheYear },
})

export const createUpdateBestOldGameAction = (bestOldGame: Game | null) => ({
  type: UPDATE_FORM,
  payload: { key: 'bestOldGame', value: bestOldGame },
})

export const createUpdateMostAnticipatedAction = (
  mostAnticipated: Game | null,
) => ({
  type: UPDATE_FORM,
  payload: { key: 'mostAnticipated', value: mostAnticipated },
})

export const createUpdateEnteredGiveawayAction = (
  enteredGiveaway: boolean,
) => ({
  type: UPDATE_FORM,
  payload: { key: 'enteredGiveaway', value: enteredGiveaway },
})

export type SubmissionAction =
  | { type: typeof SET; payload: Submission }
  | { type: typeof UPDATE_FORM; payload: { key: keyof Submission; value: any } }
  | { type: typeof SUBMIT_SUCCESS; payload: Submission }
