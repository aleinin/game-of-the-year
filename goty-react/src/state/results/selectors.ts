import { AppState } from '../store'

export const selectResults = (state: AppState) => state.results.results

export const selectSubmissions = (state: AppState) => state.results.submissions

export const selectIsLoading = (state: AppState) => state.results.isLoading
