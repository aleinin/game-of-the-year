import {Component} from '@angular/core'
import {lastTime} from 'src/api/constants'
import {AppService} from '../../api/app/app.service'
import {AppQuery} from '../../api/app/app.store'

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.scss']
})
export class GiveawayComponent {
  title = 'Giveaway'
  lastTime = lastTime
  giveaway$ = this.appQuery.selectGiveaway()

  constructor(public readonly appService: AppService,
              private readonly appQuery: AppQuery) {
  }
}
