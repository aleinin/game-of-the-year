import {Component, EventEmitter, Input, Output} from '@angular/core'
import {Game, GameService} from '../../../api/game.service'
import {Subject} from 'rxjs'
import {switchMap} from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() placeholder = ''
  @Input() year: number | undefined
  @Input() limit = 10
  @Output() gameSelected = new EventEmitter<Game>()
  selectableGames: Game[]
  completeMethod = new Subject<string>()
  input = ''

  constructor(private readonly gameService: GameService) {
    this.completeMethod.asObservable().pipe(
      switchMap((searchText) => this.gameService.searchGames(searchText, 10, this.year))
    ).subscribe((selectableGames) => {
      this.selectableGames = selectableGames
    })
  }

  selectGame(game: Game) {
    this.gameSelected.emit(game)
    this.input = ''
  }

}
