import {Component} from '@angular/core'
import {ResultsQuery} from '../../../api/results/results.store'
import {filter, first, switchMap} from 'rxjs/operators'
import {BehaviorSubject} from 'rxjs'
import {ResultsService} from '../../../api/results/results.service'

@Component({
  selector: 'app-results-submission',
  templateUrl: './results-submission.component.html',
  styleUrls: ['./results-submission.component.scss']
})
export class ResultsSubmissionComponent {
  currentIndexSubject = new BehaviorSubject(0)
  submission$ = this.currentIndexSubject.pipe(
    switchMap((index) => this.resultsQuery.selectSubmission(index))
  )
  totalSubmissions$ = this.resultsQuery.selectLengthOfSubmissions()
  loading$ = this.resultsQuery.selectLoading()

  constructor(private readonly resultsQuery: ResultsQuery,
              private readonly resultsService: ResultsService) {
    this.resultsQuery.selectHasSubmissions().pipe(
      first(),
      filter((hasSubmissions) => !hasSubmissions),
      switchMap(() => this.resultsService.fetchSubmissions())
    ).subscribe()
  }

}
