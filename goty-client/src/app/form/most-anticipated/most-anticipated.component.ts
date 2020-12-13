import {Component} from '@angular/core'
import {AppService} from '../../../api/app/app.service'
import {Game} from '../../../api/game.service'
import {AppQuery} from '../../../api/app/app.store'

@Component({
  selector: 'app-most-anticipated',
  templateUrl: './most-anticipated.component.html',
  styleUrls: ['./most-anticipated.component.scss']
})
export class MostAnticipatedComponent {
  title = 'What game are you looking forward to most?'
  mostAnticipated$ = this.appQuery.selectMostAnticipated()
  constructor(private readonly appService: AppService,
              private readonly appQuery: AppQuery) {
  }

  gameSelected(game: Game) {
    this.appService.setMostAnticipated(game)
  }

}
