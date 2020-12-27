import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {defaultHeaders, genericErrorHandler} from '../api-config'
import {catchError, tap} from 'rxjs/operators'
import {Game} from '../game.service'
import {ResultsService} from '../results/results.service'
import {SubmissionService} from './submission.service'
import {Submission} from './submission.store'
import {constants} from '../constants'

interface BackendSubmission {
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

const convertToBackendSubmission = (state: Submission): BackendSubmission => {
  return {
    name: state.name,
    gamesOfTheYear: state.gamesOfTheYear.map((game, i) => ({...game, rank: i})),
    mostAnticipated: state.mostAnticipated,
    bestOldGame: state.bestOldGame,
    enteredGiveaway: state.enteredGiveaway
  }
}

const convertFromBackendToSubmission = (state: BackendSubmission): Submission => {
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
export class SubmissionHttpService {
  readonly submissionsUrl = `${constants.baseUrl}/submissions`
  constructor(private readonly httpClient: HttpClient,
              private readonly submissionService: SubmissionService,
              private readonly resultsService: ResultsService ) {
  }

  getSubmission(submissionUUID: string) {
    const url = `${this.submissionsUrl}/${submissionUUID}`
    return this.httpClient.get<BackendSubmission>(url, {headers: defaultHeaders}).pipe(
      tap((submission) => {
        this.submissionService.setSubmission(convertFromBackendToSubmission(submission))
      })
    )
  }

  getAllSubmissions() {
    return this.httpClient.get<Submission[]>(this.submissionsUrl, {headers: defaultHeaders, observe: 'body'}).pipe(
      tap((submissions) => this.resultsService.setSubmissions(submissions)),
      catchError((error) => genericErrorHandler(error, 'Failed to get all submissions'))
    )
  }

  createSubmission(state: Submission) {
    return this.httpClient.post<BackendSubmission>(this.submissionsUrl, convertToBackendSubmission(state), {headers: defaultHeaders}).pipe(
      tap(({id}) => {
        localStorage.setItem('submissionUUID', id)
      }, (error) => genericErrorHandler(error, 'Failed to submit')
      )
    )
  }

  updateSubmission(state: Submission) {
    const url = `${this.submissionsUrl}/${state.submissionUUID}`
    return this.httpClient.put(url, convertToBackendSubmission(state)).pipe(
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
