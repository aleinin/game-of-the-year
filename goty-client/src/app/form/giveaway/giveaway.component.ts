import {Component, Input} from '@angular/core'
import {lastTime} from 'src/api/constants'
import {AppService} from '../../../api/app/app.service'

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.scss']
})
export class GiveawayComponent {
  @Input() enteredGiveaway
  @Input() readonly = false
  title = 'Giveaway'
  lastTime = lastTime

  constructor(public readonly appService: AppService) {
  }
}
