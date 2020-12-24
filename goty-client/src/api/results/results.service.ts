import {Injectable} from '@angular/core'
import {baseUrl, defaultHeaders, genericErrorHandler} from '../api-config'
import {HttpClient} from '@angular/common/http'
import {catchError, tap} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {Results, ResultsStore} from './results.store'
import {Submission} from '../app/app.store'

@Injectable({providedIn: 'root'})
export class ResultsService {
  readonly resultsUrl = `${baseUrl}/results`

  constructor(private readonly httpClient: HttpClient,
              private readonly resultsStore: ResultsStore) {
  }

  fetchResults(): Observable<Results> {
    return this.httpClient.get<Results>(this.resultsUrl, {headers: defaultHeaders, observe: 'body'}).pipe(
      tap((results) => this.resultsStore.setResults(results)),
      catchError((error) => genericErrorHandler(error, 'Failed to fetch results'))
    )
  }

  setSubmissions(submissions: Submission[]) {
    this.resultsStore.setSubmissions(submissions)
  }
}

