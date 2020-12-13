import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Game} from '../../../api/game.service'

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.scss']
})
export class SingleGameComponent {
  @Input() placeholder = ''
  @Input() title = ''
  @Input() game: Game
  @Output() gameSelected = new EventEmitter<Game>()
}