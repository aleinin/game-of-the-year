import {Component} from '@angular/core'
import {year} from 'src/api/constants'
import {Game} from '../../../api/game.service'
import {AppService} from '../../../api/app/app.service'
import {AppQuery} from '../../../api/app/app.store'

@Component({
  selector: 'app-old-game',
  templateUrl: './old-game.component.html',
  styleUrls: ['./old-game.component.scss']
})
export class OldGameComponent {
  title = `What is your favorite OLD game of ${year}`
  year = year
  bestOldGame$ = this.appQuery.selectBestOldGame()
  constructor(private readonly appService: AppService,
              private readonly appQuery: AppQuery) {
  }

  gameSelected(bestOldGame: Game) {
    this.appService.setBestOldGame(bestOldGame)
  }
}
