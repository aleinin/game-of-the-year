import {Component} from '@angular/core'
import {AppService} from '../../api/app/app.service'
import {Game} from '../../api/game.service'

@Component({
  selector: 'app-most-anticipated',
  templateUrl: './most-anticipated.component.html',
  styleUrls: ['./most-anticipated.component.scss']
})
export class MostAnticipatedComponent {
  title = 'What game are you looking forward to most?'

  constructor(private readonly appService: AppService) {
  }

  gameSelected(game: Game) {
    this.appService.setMostAnticipated(game)
  }

}
