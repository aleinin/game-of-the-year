import {Component} from '@angular/core'
import {giveAway} from '../../../api/constants'
import {ResultsQuery} from '../../../api/results/results.store'
import {switchMap} from 'rxjs/operators'
import {BehaviorSubject} from 'rxjs'

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
  giveaway = giveAway

  constructor(private readonly resultsQuery: ResultsQuery) {
  }

}
