import {Component, Input, Output, EventEmitter} from '@angular/core'
import {constants} from 'src/api/constants'

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.component.html',
  styleUrls: ['./giveaway.component.scss']
})
export class GiveawayComponent {
  @Input() enteredGiveaway
  @Input() readonly = false
  @Output() giveawayChange = new EventEmitter<boolean>()
  title = 'Giveaway'
  lastTime = constants.lastTime
}
