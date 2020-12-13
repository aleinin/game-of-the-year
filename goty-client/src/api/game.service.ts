import {Injectable} from '@angular/core'
import {of} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http'
import {defaultHeaders} from './api-config'

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
      catchError((error) => {
        console.error('Service Call Failed')
        console.error(error)
        return of(error)
      })
    )
  }
}
