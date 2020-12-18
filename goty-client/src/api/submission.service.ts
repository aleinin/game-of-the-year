import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Submission} from './app/app.store'
import {baseUrl, defaultHeaders, genericErrorHandler} from './api-config'
import {catchError, tap} from 'rxjs/operators'
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

const convertToBackendForm = (state: Submission): BackendForm => {
  return {
    name: state.name,
    gamesOfTheYear: state.gamesOfTheYear.map((game, i) => ({...game, rank: i})),
    mostAnticipated: state.mostAnticipated,
    bestOldGame: state.bestOldGame,
    enteredGiveaway: state.enteredGiveaway
  }
}

const convertFromBackendToAppState = (state: BackendForm): Submission => {
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
export class SubmissionService {
  readonly submissionsUrl = `${baseUrl}/submissions`
  constructor(private readonly httpClient: HttpClient,
              private readonly appService: AppService) {
  }

  getSubmission(submissionUUID: string) {
    const url = `${this.submissionsUrl}/${submissionUUID}`
    return this.httpClient.get<BackendForm>(url, {headers: defaultHeaders}).pipe(
      tap((form) => {
        this.appService.setForm(convertFromBackendToAppState(form))
      })
    )
  }

  submitNewForm(state: Submission) {
    const url = `${this.submissionsUrl}`
    return this.httpClient.post<BackendForm>(url, convertToBackendForm(state), {headers: defaultHeaders}).pipe(
      tap(({id}) => {
        localStorage.setItem('submissionUUID', id)
      }, (error) => genericErrorHandler(error, 'Failed to submit')
      )
    )
  }

  updateSubmission(state: Submission) {
    const url = `${this.submissionsUrl}/${state.submissionUUID}`
    return this.httpClient.put(url, convertToBackendForm(state)).pipe(
      catchError((error) => genericErrorHandler(error, 'Failed to update submission'))
    )
  }

  deleteSubmission(submissionUUID: string) {
    const url = `${this.submissionsUrl}/${submissionUUID}`
    return this.httpClient.delete(url, {headers: defaultHeaders}).pipe(
      catchError((error) => genericErrorHandler(error, 'Failed to delete submission'))
    )
  }
}
