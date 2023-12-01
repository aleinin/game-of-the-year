import { SET, SubmissionAction, SUBMIT_SUCCESS, UPDATE_FORM } from './actions'
import { Submission } from '../../models/submission'

export interface SubmissionState {
  form: Submission
  isEdit: boolean
  initialForm: Submission
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
}

const setExistingSubmission = (
  state: SubmissionState,
  submission: Submission,
): SubmissionState => ({
  ...state,
  isEdit: true,
  initialForm: submission,
  form: submission,
})

export const submissionReducer = (
  state = initialState,
  action: SubmissionAction,
): SubmissionState => {
  switch (action.type) {
    case SET:
      return setExistingSubmission(state, action.payload)
    case UPDATE_FORM:
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.key]: action.payload.value,
        },
      }
    case SUBMIT_SUCCESS:
      return {
        ...setExistingSubmission(state, action.payload),
      }
    default: {
      return state
    }
  }
}
