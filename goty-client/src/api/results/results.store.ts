import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'
import {filter, map, pluck} from 'rxjs/operators'
import {Submission} from '../submission/submission.store'
import {Observable} from 'rxjs'

export interface ResultsState {
  results: Results,
  submissions: Submission[],
  hasResults: boolean
  hasSubmissions: boolean
}

export interface GameOfTheYearResult extends GameResult {
  points: number
}

export interface GameResult {
  id: string
  rank: number
  title: string
  votes: number
}

export interface Results {
  participants: string[],
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGame: GameResult[]
  giveawayParticipants: string[]
}

export function createInitialState(): ResultsState {
  return {
    results: null,
    submissions: [],
    hasResults: false,
    hasSubmissions: false
  }
}

@StoreConfig({name: 'resultStore'})
@Injectable({providedIn: 'root'})
export class ResultsStore extends Store<ResultsState> {
  constructor() {
    super(createInitialState())
  }

  setResults(results: Results) {
    this.update((state) => ({
      ...state,
      results,
      hasResults: true
    }))
  }

  setSubmissions(submissions: Submission[]) {
    this.update((state) => ({
      ...state,
      submissions,
      hasSubmissions: true
    }))
  }
}

@Injectable({providedIn: 'root'})
export class ResultsQuery extends Query<ResultsState> {
  constructor(protected store: ResultsStore) {
    super(store)
  }

  selectResults(prop: keyof Results): Observable<any> {
    return this.select('results').pipe(
      filter((results) => results != null),
      pluck(prop)
    )
  }

  selectSubmission(index: number) {
    return this.select('submissions').pipe(
      map((submissions) => {
        if (!Array.isArray(submissions)) {
          return null
        }
        if (index < 0) {
          return submissions[0]
        }
        if (index > submissions.length - 1) {
          return submissions[submissions.length - 1]
        }
        return submissions[index]
      })
    )
  }

  selectLengthOfSubmissions() {
    return this.select('submissions').pipe(
      map((submissions) => Array.isArray(submissions) ? submissions.length : 0)
    )
  }

  selectHasResults() {
    return this.select('hasResults')
  }

  selectHasSubmissions() {
    return this.select('hasSubmissions')
  }
}
