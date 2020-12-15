import {Injectable} from '@angular/core'
import {catchError} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import {defaultHeaders, genericErrorHandler} from './api-config'

export interface Game {
  id: string,
  title: string
}

@Injectable({providedIn: 'root'})
export class GameService {

  constructor(private readonly httpClient: HttpClient) {
  }

  searchGames(input: string, limit: number, year?: number) {
    let url = `https://goty.gorlah.com/games?title=${input}&limit=${limit}`
    if (year != null) {
      url = `${url}&year=${year}`
    }
    return this.httpClient.get<Game[]>(url, {observe: 'body', headers: defaultHeaders}).pipe(
      catchError((error) => genericErrorHandler(error, 'Search call failed'))
    )
  }
}
