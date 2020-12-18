import {Injectable} from '@angular/core'
import {baseUrl, defaultHeaders, genericErrorHandler} from '../api-config'
import {HttpClient} from '@angular/common/http'
import {delay, tap} from 'rxjs/operators'
import {Observable, of} from 'rxjs'
import {GameOfTheYearResult, GameResult, Results, ResultsStore} from './results.store'

// TODO BEGIN MOCK
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createMockGamesOfTheYear = (numOfGamesToCreate: number): GameOfTheYearResult[] => {
  const games = []
  for (let i = 0; i < numOfGamesToCreate ; i++) {
    games.push({
      title: `Game ${i}`,
      votes: randomNumber(1, 10),
      points: randomNumber(1, 50),
      rank: -1
    })
  }
  return games.sort((a, b) => {
    if (a.votes < b.votes) {
      return 1
    }
    if (a.votes > b.votes) {
      return -1
    }
    if (a.points < b.points) {
      return 1
    }
    if (a.points > b.points) {
      return -1
    }
    return 0
  }).map((game, rank) => ({...game, rank: rank + 1}))
}

const createMockGames = (numOfGamesToCreate: number): GameResult[] => {
  return createMockGamesOfTheYear(numOfGamesToCreate).map((game) => ({rank: game.rank, title: game.title, votes: game.votes}))
}
// TODO END MOCK

@Injectable({providedIn: 'root'})
export class ResultsService {
  readonly resultsUrl = `${baseUrl}/results`
  // TODO MOCK
  readonly tempResults: Results = {
    names: [
      'Twister',
      'Clockwise',
      'Warpath',
      'Uni',
      'Kherven',
      'Gorlah',
      'SuperKrylee'
    ],
    giveaway: [
      'Twister',
      'Clockwise',
      'Warpath',
      'Uni',
      'Kherven',
      'Gorlah',
      'SuperKrylee'
    ],
    gamesOfTheYear: createMockGamesOfTheYear(20),
    bestOldGame: createMockGames(10),
    mostAnticipated: createMockGames(10)
  }
  constructor(private readonly httpClient: HttpClient,
              private readonly resultsStore: ResultsStore) {
  }

  fetchResults(): Observable<Results> {
    // TODO MOCK
    return of(this.tempResults).pipe(
      delay(500),
      tap((results) => this.resultsStore.setResults(results))
    )
    /*return this.httpClient.get<Results>(this.resultsUrl, {headers: defaultHeaders, observe: 'body'}).pipe(
      catchError((error) => genericErrorHandler(error, 'Failed to fetch results'))
    )*/
  }
}
