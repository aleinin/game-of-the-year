import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core'
import {Game, GameService} from '../../../api/game.service'
import {BehaviorSubject, Subscription} from 'rxjs'
import {filter, skip, tap} from 'rxjs/operators'

@Component({
  selector: 'app-search-in-place',
  templateUrl: './search-in-place.component.html',
  styleUrls: ['./search-in-place.component.scss']
})
export class SearchInPlaceComponent implements OnDestroy {
  @Input() placeholder = ''
  @Input() set game(game: Game) {
    this.selectedGameSubject.next(game)
  }
  @Input() readonly = false
  @Output() gameSelected = new EventEmitter<Game>()
  selectedGameSubject = new BehaviorSubject<Game | undefined>(undefined)
  subscriptions = new Subscription()

  constructor(public readonly gameService: GameService) {
    const selectedGameSub = this.selectedGameSubject.pipe(
      skip(1),
      filter(() => !this.readonly),
      tap((game) => this.gameSelected.emit(game))
    ).subscribe()
    this.subscriptions.add(selectedGameSub)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
