import { Component } from '@angular/core'
import {ResultsQuery} from '../../api/results/results.store'
import {ResultsService} from '../../api/results/results.service'
import {first} from 'rxjs/operators'
import {ActivatedRoute, Router} from '@angular/router'
import {SubmissionHttpService} from '../../api/submission/submission-http.service'

export enum ResultTabs {
  SUMMARY,
  INDIVIDUAL
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  activateIndex = ResultTabs.SUMMARY
  constructor(private readonly resultsService: ResultsService,
              private readonly resultsQuery: ResultsQuery,
              private readonly submissionHttpService: SubmissionHttpService,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.resultsService.fetchResults().pipe(first()).subscribe()
    this.submissionHttpService.getAllSubmissions().pipe(first()).subscribe()
    this.activateIndex = this.router.url.includes('summary') ? ResultTabs.SUMMARY : ResultTabs.INDIVIDUAL
  }
  change(index: ResultTabs) {
    this.router.navigate([index === ResultTabs.SUMMARY ? 'summary' : 'individual'], {relativeTo: this.route})
  }

}
