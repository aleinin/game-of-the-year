import {Injectable} from '@angular/core'
import {catchError} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import {baseUrl, defaultHeaders, genericErrorHandler} from './api-config'

export interface Game {
  id: string,
  title: string
}

@Injectable({providedIn: 'root'})
export class GameService {
  readonly gamesUrl = `${baseUrl}/games`
  constructor(private readonly httpClient: HttpClient) {
  }

  searchGames(input: string, limit: number, year?: number) {
    let url = `${this.gamesUrl}?title=${input}&limit=${limit}`
    if (year != null) {
      url = `${url}&year=${year}`
    }
    return this.httpClient.get<Game[]>(url, {observe: 'body', headers: defaultHeaders}).pipe(
      catchError((error) => genericErrorHandler(error, 'Search call failed'))
    )
  }
}
