import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'
import {Submission} from '../app/app.store'
import {pluck} from 'rxjs/operators'

export interface ResultsState {
  results: Results,
  submissions: Submission[] // TODO
}

export interface GameOfTheYearResult extends GameResult {
  points: number
}

export interface GameResult {
  rank: number
  title: string
  votes: number
}

export interface Results {
  names: string[],
  gamesOfTheYear: GameOfTheYearResult[]
  mostAnticipated: GameResult[]
  bestOldGame: GameResult[]
  giveaway: string[]
}

export function createInitialState(): ResultsState {
  return {
    results: null,
    submissions: null
  }
}

@StoreConfig({name: 'results'})
@Injectable({providedIn: 'root'})
export class ResultsStore extends Store<ResultsState> {
  constructor() {
    super(createInitialState())
  }

  setResults(results: Results) {
    this.update((state) => ({...state, results}))
  }

  setSubmissions(submissions: Submission[]) {
    this.update((state) => ({...state, submissions}))
  }
}

@Injectable({providedIn: 'root'})
export class ResultsQuery extends Query<ResultsState> {
  constructor(protected store: ResultsStore) {
    super(store)
  }

  selectResult(prop: keyof Results) {
    return this.select('results').pipe(
      pluck(prop)
    )
  }

  selectSubmissions() {
    return this.select('submissions')
  }
}
