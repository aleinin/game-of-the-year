import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {AppState} from './app/app.store'
import {Game} from './game.service'
import {defaultHeaders} from './api-config'
import {catchError} from 'rxjs/operators'
import {of} from 'rxjs'

interface BackendSubmission {
  name: string,
  gameSubmissions: BackendGame[]
  mostAnticipated: Game,
  bestOldGame: Game
}

interface BackendGame extends Game {
  rank: number
}

@Injectable({providedIn: 'root'})
export class SubmissionService {

  constructor(private readonly httpClient: HttpClient) {
  }

  submit(app: AppState) {
    const url = 'https://goty.gorlah.com/submit'
    const submission: BackendSubmission = {
      name: app.name,
      gameSubmissions: app.gameOfTheYear.map((game, i) => ({...game, rank: i})),
      mostAnticipated: app.mostAnticipated,
      bestOldGame: app.oldGame
    }
    return this.httpClient.post(url, submission, {headers: defaultHeaders}).pipe(
      catchError((error) => {
        console.error('Failed to submit')
        console.error(error)
        return of(error)
      })
    )
  }
}
