import {Component} from '@angular/core'
import {year} from 'src/api/constants'
import {Game} from '../../api/game.service'
import {AppService} from '../../api/app/app.service'

@Component({
  selector: 'app-old-game',
  templateUrl: './old-game.component.html',
  styleUrls: ['./old-game.component.scss']
})
export class OldGameComponent {
  title = `What is your favorite OLD game of ${year}`
  year = year

  constructor(private readonly appService: AppService) {
  }

  gameSelected(game: Game) {
    this.appService.setOldGame(game)
  }
}
