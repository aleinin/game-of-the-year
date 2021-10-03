import { isEqual } from 'lodash'
import { Submission } from '../../api/submissionService'
import { Actions, SubmissionActions } from './actions'

export enum SubmissionStep {
  Start,
  Form,
  End,
}

export interface SubmissionState {
  form: Submission
  isEdit: boolean
  isValid: boolean
  initialForm: Submission
  step: SubmissionStep
  error: any
}

const defaultForm: Submission = {
  submissionUUID: '',
  name: '',
  gamesOfTheYear: [],
  bestOldGame: null,
  mostAnticipated: null,
  enteredGiveaway: null,
}

const initialState: SubmissionState = {
  form: defaultForm,
  initialForm: defaultForm,
  isEdit: false,
  isValid: false,
  step: SubmissionStep.Start,
  error: null,
}

const isValid = (form: Submission, initialForm: Submission) =>
  !isEqual(form, initialForm) &&
  form.name?.length > 0 &&
  form.gamesOfTheYear?.length > 0 &&
  form.enteredGiveaway != null

const setExistingSubmission = (
  state: SubmissionState,
  action: Actions
): SubmissionState => ({
  ...state,
  isEdit: true,
  initialForm: action.payload,
  form: action.payload,
  isValid: false,
})

export const submissionReducer = (
  state = initialState,
  action: Actions
): SubmissionState => {
  switch (action.type) {
    case SubmissionActions.SET:
      return setExistingSubmission(state, action)
    case SubmissionActions.UPDATE_FORM:
      const newForm = {
        ...state.form,
        [action.payload.key]: action.payload.value,
      }
      return {
        ...state,
        form: newForm,
        isValid: isValid(newForm, state.initialForm),
      }
    case SubmissionActions.NEXT_STEP:
      let step: SubmissionStep
      switch (state.step) {
        case SubmissionStep.Start:
          step = SubmissionStep.Form
          break
        case SubmissionStep.End:
          step = SubmissionStep.Start
          break
        default:
          throw new Error(
            `Bad State/Action: ${JSON.stringify(action)} ${JSON.stringify(
              state
            )}`
          )
      }
      return {
        ...state,
        step,
      }
    case SubmissionActions.RECOVER_SUBMISSION:
      return {
        ...state,
        step: SubmissionStep.Form,
      }
    case SubmissionActions.SUBMIT_SUCCESS:
      return {
        ...setExistingSubmission(state, action),
        step: SubmissionStep.End,
      }
    case SubmissionActions.SUBMIT_FAIL:
      return {
        ...state,
        error: action.payload,
        step: SubmissionStep.End,
      }
    default: {
      return state
    }
  }
}
