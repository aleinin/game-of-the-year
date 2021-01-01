import {Component} from '@angular/core'
import {first} from 'rxjs/operators'
import {ResultsService} from '../api/results/results.service'
import {SubmissionHttpService} from '../api/submission/submission-http.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private readonly resultsService: ResultsService,
              private readonly submissionHttpService: SubmissionHttpService) {
    this.fetchResults()
  }

  fetchResults() {
    this.resultsService.fetchResults().pipe(first()).subscribe()
    this.submissionHttpService.getAllSubmissions().pipe(first()).subscribe()
  }

}
