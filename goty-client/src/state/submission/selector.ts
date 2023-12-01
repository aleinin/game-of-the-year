import { AppState } from '../store'

export const selectIsEdit = (state: AppState) => state.submission.isEdit

export const selectSubmissionState = (state: AppState) => state.submission
