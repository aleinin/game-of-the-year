import {
  NEXT_STEP,
  RECOVER_SUBMISSION,
  SET,
  SET_VALIDATOR_FN,
  SubmissionAction,
  SUBMIT_FAIL,
  SUBMIT_SUCCESS,
  UPDATE_FORM,
} from './actions'
import { isEqual, Submission } from '../../models/Submission'

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
  validatorFn: (state: SubmissionState) => boolean
}

const defaultForm: Submission = {
  submissionUUID: '',
  name: '',
  gamesOfTheYear: [],
  bestOldGame: null,
  mostAnticipated: null,
  enteredGiveaway: null,
}

export const isValid = ({ form, initialForm }: SubmissionState) =>
  !isEqual(form, initialForm) &&
  form.name?.length > 0 &&
  form.gamesOfTheYear?.length > 0

const isValidWithGiveaway = (state: SubmissionState) =>
  isValid(state) && state.form.enteredGiveaway != null

const initialState: SubmissionState = {
  form: defaultForm,
  initialForm: defaultForm,
  isEdit: false,
  isValid: false,
  step: SubmissionStep.Start,
  error: null,
  validatorFn: isValidWithGiveaway,
}

const setExistingSubmission = (
  state: SubmissionState,
  submission: Submission,
): SubmissionState => ({
  ...state,
  isEdit: true,
  initialForm: submission,
  form: submission,
  isValid: false,
})

export const submissionReducer = (
  state = initialState,
  action: SubmissionAction,
): SubmissionState => {
  switch (action.type) {
    case SET:
      return setExistingSubmission(state, action.payload)
    case UPDATE_FORM:
      const newStateUnvalidated = {
        ...state,
        form: {
          ...state.form,
          [action.payload.key]: action.payload.value,
        },
      }
      return {
        ...newStateUnvalidated,
        isValid: state.validatorFn(newStateUnvalidated),
      }
    case NEXT_STEP:
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
              state,
            )}`,
          )
      }
      return {
        ...state,
        step,
      }
    case RECOVER_SUBMISSION:
      return {
        ...state,
        step: SubmissionStep.Form,
      }
    case SUBMIT_SUCCESS:
      return {
        ...setExistingSubmission(state, action.payload),
        step: SubmissionStep.End,
      }
    case SUBMIT_FAIL:
      return {
        ...state,
        error: action.payload,
        step: SubmissionStep.End,
      }
    case SET_VALIDATOR_FN:
      return {
        ...state,
        validatorFn: action.payload,
      }
    default: {
      return state
    }
  }
}
