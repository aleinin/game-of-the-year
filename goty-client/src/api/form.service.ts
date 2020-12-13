import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {AppState} from './app/app.store'
import {defaultHeaders} from './api-config'
import {catchError, tap} from 'rxjs/operators'
import {of} from 'rxjs'
import {Game} from './game.service'
import {AppService} from './app/app.service'

interface BackendForm {
  id?: string
  name: string,
  gamesOfTheYear: BackendGamesOfTheYear[]
  mostAnticipated: Game,
  bestOldGame: Game,
  enteredGiveaway: boolean
}

interface BackendGamesOfTheYear extends Game {
  rank: number
}

const convertToBackendForm = (state: AppState): BackendForm => {
  return {
    name: state.name,
    gamesOfTheYear: state.gamesOfTheYear.map((game, i) => ({...game, rank: i})),
    mostAnticipated: state.mostAnticipated,
    bestOldGame: state.bestOldGame,
    enteredGiveaway: state.enteredGiveaway
  }
}

const convertFromBackendToAppState = (state: BackendForm): AppState => {
  return {
    submissionUUID: state.id,
    name: state.name,
    gamesOfTheYear: state.gamesOfTheYear.map((game) => ({title: game.title, id: game.id})),
    mostAnticipated: state.mostAnticipated,
    bestOldGame: state.bestOldGame,
    enteredGiveaway: state.enteredGiveaway
  }
}

@Injectable({providedIn: 'root'})
export class FormService {
  readonly baseUrl = 'https://goty.gorlah.com'
  constructor(private readonly httpClient: HttpClient,
              private readonly appService: AppService) {
  }

  getForm(submissionUUID: string) {
    const url = `${this.baseUrl}/submissions/${submissionUUID}`
    return this.httpClient.get<BackendForm>(url, {headers: defaultHeaders}).pipe(
      tap((form) => {
        this.appService.setForm(convertFromBackendToAppState(form))
      })
    )
  }

  submitNewForm(state: AppState) {
    const url = `${this.baseUrl}/submissions`
    return this.httpClient.post<BackendForm>(url, convertToBackendForm(state), {headers: defaultHeaders}).pipe(
      tap(({id}) => {
        localStorage.setItem('submissionUUID', id)
      }),
      catchError((error) => {
        console.error('Failed to submit')
        console.error(error)
        return of(error)
      })
    )
  }

  updateForm(state: AppState) {
    const url = `${this.baseUrl}/submissions/${state.submissionUUID}`
    return this.httpClient.put(url, convertToBackendForm(state)).pipe(
      catchError((error) => {
        console.error('Failed to update submission')
        console.error(error)
        return of(error)
      })
    )
  }
}
