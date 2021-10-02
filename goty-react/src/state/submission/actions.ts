import { Game } from '../../models/game'
import { Submission } from '../../models/submission'
import { SubmissionStep } from './reducer'

export enum SubmissionActions {
  SET = 'SET',
  UPDATE_FORM = 'UPDATE_FORM',
  NEXT_STEP = 'NEXT_STEP',
}

// todo redundant
export const setSubmission = (submission: Submission) => ({
  type: SubmissionActions.SET,
  payload: submission,
})

export const updateForm = (key: keyof Submission, value: any) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key, value },
})

export const createNextStepAction = (error?: any) => ({
  type: SubmissionActions.NEXT_STEP,
  payload: error,
})

// todo typing
export type Actions = {
  type: string
  payload: any
}

export const createSetSubmissionAction = (submission: Submission) => ({
  type: SubmissionActions.SET,
  payload: submission,
})

export const createUpdateSubmissionUUIDAction = (uuid: string) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'submissionUUID', value: uuid },
})

export const createUpdateNameAction = (name: string) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'name', value: name },
})

export const createUpdateGamesOfTheYearAction = (gamesOfTheYear: Game[]) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'gamesOfTheYear', value: gamesOfTheYear },
})

export const createUpdateBestOldGameAction = (bestOldGame: Game | null) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'bestOldGame', value: bestOldGame },
})

export const createUpdateMostAnticipatedAction = (
  mostAnticipated: Game | null
) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'mostAnticipated', value: mostAnticipated },
})

export const createUpdateEnteredGiveawayAction = (
  enteredGiveaway: boolean
) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key: 'enteredGiveaway', value: enteredGiveaway },
})
