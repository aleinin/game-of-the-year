import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Game} from '../../../api/game.service'

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() game: Game
  @Input() index: number
  @Input() length: number
  @Input() orderable = true
  @Output() delete = new EventEmitter<number>()
  @Output() moveUp = new EventEmitter<number>()
  @Output() moveDown = new EventEmitter<number>()

  constructor() {
  }
}
