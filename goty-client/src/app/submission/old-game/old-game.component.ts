import {Component, Input} from '@angular/core'
import {constants} from 'src/api/constants'
import {Game} from '../../../api/game.service'
import {SubmissionService} from '../../../api/submission/submission.service'

@Component({
  selector: 'app-old-game',
  templateUrl: './old-game.component.html',
  styleUrls: ['./old-game.component.scss']
})
export class OldGameComponent {
  @Input() readonly = false
  @Input() bestOldGame: Game
  title = `What is your favorite OLD game of ${constants.year}`
  year = constants.year
  constructor(private readonly submissionService: SubmissionService) {
  }

  gameSelected(bestOldGame: Game) {
    this.submissionService.setBestOldGame(bestOldGame)
  }
}
