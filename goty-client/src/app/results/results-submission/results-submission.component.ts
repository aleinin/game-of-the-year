import {Component, Input, OnInit} from '@angular/core'
import {giveAway} from '../../../api/constants'
import {Submission} from '../../../api/app/app.store'

@Component({
  selector: 'app-results-submission',
  templateUrl: './results-submission.component.html',
  styleUrls: ['./results-submission.component.scss']
})
export class ResultsSubmissionComponent {
  @Input() submissions: Submission[]
  giveaway = giveAway
  constructor() { }
}
