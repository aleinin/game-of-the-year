import {Component} from '@angular/core'
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
  activateIndex = ResultTabs.SUMMARY

  constructor(private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.activateIndex = this.router.url.includes('summary') ? ResultTabs.SUMMARY : ResultTabs.INDIVIDUAL
  }

  change(index: ResultTabs) {
    this.router.navigate([index === ResultTabs.SUMMARY ? 'summary' : 'individual'], {relativeTo: this.route})
  }

}
