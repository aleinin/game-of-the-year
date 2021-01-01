import {Injectable} from '@angular/core'
import {defaultHeaders, genericErrorHandler} from '../api-config'
import {HttpClient} from '@angular/common/http'
import {tap} from 'rxjs/operators'
import {Results, ResultsStore} from './results.store'
import {constants} from '../constants'
import {SubmissionHttpService} from '../submission/submission-http.service'

@Injectable({providedIn: 'root'})
export class ResultsService {
  private readonly resultsUrl = `${constants.baseUrl}/results`

  constructor(private readonly httpClient: HttpClient,
              private readonly resultsStore: ResultsStore,
              private readonly submissionHttpService: SubmissionHttpService) {
  }

  fetchResults() {
    this.resultsStore.setLoading(true)
    return this.httpClient.get<Results>(this.resultsUrl, {headers: defaultHeaders, observe: 'body'}).pipe(
      tap((results) => {
          this.resultsStore.setLoading(false)
          this.resultsStore.setResults(results)
        },
        (error) => genericErrorHandler(error, 'Failed to fetch results'))    )
  }

  fetchSubmissions() {
    this.resultsStore.setLoading(true)
    return this.submissionHttpService.getAllSubmissions().pipe(
      tap((submissions) => {
          this.resultsStore.setLoading(false)
          this.resultsStore.setSubmissions(submissions)
        },
        (error) => genericErrorHandler(error, 'Failed to fetch submissions'))    )
  }
}

