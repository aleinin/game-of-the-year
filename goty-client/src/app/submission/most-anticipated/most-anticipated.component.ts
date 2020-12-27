import {Component, Input} from '@angular/core'
import {Game} from '../../../api/game.service'
import {SubmissionService} from '../../../api/submission/submission.service'

@Component({
  selector: 'app-most-anticipated',
  templateUrl: './most-anticipated.component.html',
  styleUrls: ['./most-anticipated.component.scss']
})
export class MostAnticipatedComponent {
  @Input() mostAnticipated: Game
  @Input() readonly = false
  title = 'What game are you looking forward to most?'
  constructor(private readonly submissionService: SubmissionService) {
  }

  gameSelected(game: Game) {
    this.submissionService.setMostAnticipated(game)
  }

}
