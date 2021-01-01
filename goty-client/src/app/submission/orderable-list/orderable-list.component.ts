import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Game} from '../../../api/game.service'

const inBounds = (index: number, moveBy: 1 | -1, length: number) => {
  return (moveBy === 1 && index < length - 1)
    || (moveBy === -1 && index > 0)
}

@Component({
  selector: 'app-orderable-list',
  templateUrl: './orderable-list.component.html',
  styleUrls: ['./orderable-list.component.scss']
})
export class OrderableListComponent {
  @Input() readonly = false
  @Input() games: Game[]
  @Output() orderChanges = new EventEmitter<Game[]>()

  deleteGame(index: number) {
    if (index > -1 && index < this.games.length) {
      const newList = this.games.filter((game, i) => i !== index)
      this.orderChanges.emit(newList)
    }
  }

  reorderList(index: number, moveBy: 1 | -1) {
    if (inBounds(index, moveBy, this.games.length)) {
      this.orderChanges.emit(this.swap(index, moveBy))
    }
  }

  private swap(index: number, moveBy: 1 | -1) {
    const newList = [...this.games]
    const temp = newList[index]
    newList[index] = newList[index + moveBy]
    newList[index + moveBy] = temp
    return newList
  }
}
