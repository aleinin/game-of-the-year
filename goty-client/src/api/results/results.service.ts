import {Injectable} from '@angular/core'
import {baseUrl, defaultHeaders, genericErrorHandler} from '../api-config'
import {HttpClient} from '@angular/common/http'
import {tap} from 'rxjs/operators'
import {Observable} from 'rxjs'
import {Results, ResultsStore} from './results.store'
import {Submission} from '../submission/submission.store'

@Injectable({providedIn: 'root'})
export class ResultsService {
  readonly resultsUrl = `${baseUrl}/results`

  constructor(private readonly httpClient: HttpClient,
              private readonly resultsStore: ResultsStore) {
  }

  fetchResults(): Observable<Results> {
    this.resultsStore.setLoading(true)
    return this.httpClient.get<Results>(this.resultsUrl, {headers: defaultHeaders, observe: 'body'}).pipe(
      tap((results) => {
        this.resultsStore.setLoading(false)
        this.resultsStore.setResults(results)
      }, (error) => genericErrorHandler(error, 'Failed to fetch results')),
    )
  }

  setSubmissions(submissions: Submission[]) {
    this.resultsStore.setSubmissions(submissions)
  }
}

