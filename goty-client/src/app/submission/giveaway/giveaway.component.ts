import {Component, Input} from '@angular/core'
import {constants} from 'src/api/constants'
import {SubmissionService} from '../../../api/submission/submission.service'

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.scss']
})
export class GiveawayComponent {
  @Input() enteredGiveaway
  @Input() readonly = false
  title = 'Giveaway'
  lastTime = constants.lastTime

  constructor(public readonly submissionService: SubmissionService) {
  }

  setEnteredGiveaway(enteredGiveaway: boolean) {
    if (!this.readonly) {
      this.submissionService.setEnteredGiveaway(enteredGiveaway)
    }
  }
}
