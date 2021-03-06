import {Component, Input} from '@angular/core'
import {constants} from 'src/api/constants'
import {Game} from '../../../api/game.service'
import {SubmissionService} from '../../../api/submission/submission.service'

@Component({
  selector: 'app-game-of-the-year',
  templateUrl: './game-of-the-year.component.html',
  styleUrls: ['./game-of-the-year.component.scss']
})
export class GameOfTheYearComponent {
  @Input() readonly = false
  @Input() name = ''
  @Input() gamesOfTheYear: Game[]
  year = constants.year
  closeDate = constants.closeDate
  tiePoints = constants.tiePoints
  games: Game[] = []
  title = `What are your favorite game(s) of ${constants.year}?`
  constructor(public readonly submissionService: SubmissionService) {
  }
}
