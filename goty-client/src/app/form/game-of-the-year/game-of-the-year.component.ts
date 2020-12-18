import {Component, Input} from '@angular/core'
import {closeDate, tiePoints, year} from 'src/api/constants'
import {Game} from '../../../api/game.service'
import {AppService} from '../../../api/app/app.service'
import {AppQuery} from '../../../api/app/app.store'

@Component({
  selector: 'app-game-of-the-year',
  templateUrl: './game-of-the-year.component.html',
  styleUrls: ['./game-of-the-year.component.scss']
})
export class GameOfTheYearComponent {
  @Input() showInstructions = true
  @Input() readonly = false
  @Input() name = ''
  @Input() gamesOfTheYear: Game[]
  year = year
  closeDate = closeDate
  tiePoints = tiePoints
  games: Game[] = []
  title = `What are your favorite game(s) of ${year}?`
 /* name$ = this.appQuery.selectName()
  goty$ = this.appQuery.selectGamesOfTheYear()*/

  constructor(public readonly appService: AppService,
              private readonly appQuery: AppQuery) {
  }
}
