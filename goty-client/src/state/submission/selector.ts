import { AppState } from '../store'

export const selectIsEdit = (state: AppState) => state.submission.isEdit

export const selectSubmissionState = (state: AppState) => state.submission

export const selectError = (state: AppState) => state.submission.error
