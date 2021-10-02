import { isEqual } from 'lodash'
import { Submission } from '../../models/submission'
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

export const submissionReducer = (
  state = initialState,
  action: Actions
): SubmissionState => {
  switch (action.type) {
    case SubmissionActions.SET:
      return {
        ...state,
        isEdit: true,
        initialForm: action.payload,
        form: action.payload,
        isValid: false,
      }
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
      let nextStep: SubmissionStep
      let error = null
      switch (state.step) {
        case SubmissionStep.Start:
          nextStep = SubmissionStep.Form
          break
        case SubmissionStep.Form:
          error = action.payload ?? null
          nextStep = SubmissionStep.End
          break
        case SubmissionStep.End:
          nextStep = SubmissionStep.Start
          break
      }
      return {
        ...state,
        step: nextStep,
        error,
      }
    default: {
      return state
    }
  }
}
