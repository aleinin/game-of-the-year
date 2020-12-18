import { Component } from '@angular/core'
import {ResultsQuery} from '../../api/results/results.store'
import {ResultsService} from '../../api/results/results.service'
import {first} from 'rxjs/operators'
import {ActivatedRoute, Router} from '@angular/router'

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
  constructor(private readonly resultsService: ResultsService,
              private readonly resultsQuery: ResultsQuery,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.resultsService.fetchResults().pipe(first()).subscribe()
  }
  change(index: ResultTabs) {
    this.router.navigate([index === ResultTabs.SUMMARY ? 'summary' : 'individual'], {relativeTo: this.route})
  }

}
