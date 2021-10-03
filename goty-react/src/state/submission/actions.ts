import { Game } from '../../api/gameService'
import { Submission } from '../../api/submissionService'

export enum SubmissionActions {
  SET = 'SET',
  UPDATE_FORM = 'UPDATE_FORM',
  RECOVER_SUBMISSION = 'RECOVER_SUBMISSION',
  SUBMIT_SUCCESS = 'SUBMIT_SUCCESS',
  SUBMIT_FAIL = 'SUBMIT_FAIL',
  NEXT_STEP = 'NEXT_STEP',
}

export const updateForm = (key: keyof Submission, value: any) => ({
  type: SubmissionActions.UPDATE_FORM,
  payload: { key, value },
})

export const createNextStepAction = () => ({
  type: SubmissionActions.NEXT_STEP,
})

export const createRecoverSubmissionAction = () => ({
  type: SubmissionActions.RECOVER_SUBMISSION,
})

export const createSubmitSuccessAction = (submission: Submission) => ({
  type: SubmissionActions.SUBMIT_SUCCESS,
  payload: submission,
})

export const createSubmitFailAction = (error: any) => ({
  type: SubmissionActions.SUBMIT_FAIL,
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
