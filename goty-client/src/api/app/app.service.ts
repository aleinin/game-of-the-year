import {Injectable} from '@angular/core'
import {AppStore} from './app.store'
import {Game} from '../game.service'

@Injectable({providedIn: 'root'})
export class AppService {

  constructor(private readonly appStore: AppStore) {
  }

  setName(name: string) {
    this.appStore.setName(name)
  }

  addGameToGOTY(game: Game) {
     this.appStore.addGameToGOTY(game)
  }

  setGOTY(games: Game[]) {
    this.appStore.setGOTY(games)
  }

  setOldGame(oldGame: Game) {
    this.appStore.setOldGame(oldGame)
  }

  setMostAnticipated(mostAnticipated: Game) {
    this.appStore.setMostAnticipated(mostAnticipated)
  }

  setGiveaway(giveaway: boolean) {
    this.appStore.setGiveaway(giveaway)
  }

}
