import { Game } from '../../api/gameService'
import { Submission } from '../../api/submissionService'

export const SET = 'SET'
export const UPDATE_FORM = 'UPDATE_FORM'
export const RECOVER_SUBMISSION = 'RECOVER_SUBMISSION'
export const SUBMIT_SUCCESS = 'SUBMIT_SUCCESS'
export const SUBMIT_FAIL = 'SUBMIT_FAIL'
export const NEXT_STEP = 'NEXT_STEP'

export const updateForm = (key: keyof Submission, value: any) => ({
  type: UPDATE_FORM,
  payload: { key, value },
})

export const createNextStepAction = () => ({
  type: NEXT_STEP,
})

export const createRecoverSubmissionAction = () => ({
  type: RECOVER_SUBMISSION,
})

export const createSubmitSuccessAction = (submission: Submission) => ({
  type: SUBMIT_SUCCESS,
  payload: submission,
})

export const createSubmitFailAction = (error: any) => ({
  type: SUBMIT_FAIL,
  payload: error,
})

export const createSetSubmissionAction = (submission: Submission) => ({
  type: SET,
  payload: submission,
})

export const createUpdateSubmissionUUIDAction = (uuid: string) => ({
  type: UPDATE_FORM,
  payload: { key: 'submissionUUID', value: uuid },
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
  mostAnticipated: Game | null
) => ({
  type: UPDATE_FORM,
  payload: { key: 'mostAnticipated', value: mostAnticipated },
})

export const createUpdateEnteredGiveawayAction = (
  enteredGiveaway: boolean
) => ({
  type: UPDATE_FORM,
  payload: { key: 'enteredGiveaway', value: enteredGiveaway },
})

export type SubmissionAction =
  | { type: typeof SET; payload: Submission }
  | { type: typeof UPDATE_FORM; payload: { key: keyof Submission; value: any } }
  | { type: typeof RECOVER_SUBMISSION }
  | { type: typeof SUBMIT_SUCCESS; payload: Submission }
  | { type: typeof SUBMIT_FAIL; payload: any }
  | { type: typeof NEXT_STEP }
