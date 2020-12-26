import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'
import {Submission} from '../app/app.store'
import {map, pluck} from 'rxjs/operators'

export interface ResultsState {
  results: Results,
  submissions: Submission[]
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
    submissions: []
  }
}

export interface Rankable {
  rank: number
}

const makeRankHumanReadable = <T extends Rankable> (results: T[]): T[] => {
  return results.map((result) => ({...result, rank: result.rank + 1}))
}

const incrementRankInResults = (results: Results): Results => {
  if (results == null) {
    return null
  }
  return {
    ...results,
    gamesOfTheYear: makeRankHumanReadable(results.gamesOfTheYear),
    mostAnticipated: makeRankHumanReadable(results.mostAnticipated),
    bestOldGame: makeRankHumanReadable(results.bestOldGame)
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

  selectHumanReadableResults() {
    return this.select('results').pipe(
      map((results) => incrementRankInResults(results))
    )
  }

  selectParticipants() {
    return this.select('results').pipe(
      pluck('participants')
    )
  }

  selectGiveawayParticipants() {
    return this.select('results').pipe(
      pluck('giveawayParticipants')
    )
  }

  selectGamesOfTheYear() {
    return this.selectHumanReadableResults().pipe(
      pluck('gamesOfTheYear')
    )
  }

  selectMostAnticipated() {
    return this.selectHumanReadableResults().pipe(
      pluck('mostAnticipated')
    )
  }

  selectBestOldGame() {
    return this.selectHumanReadableResults().pipe(
      pluck('bestOldGame')
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
        if (index  > submissions.length - 1) {
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
}
