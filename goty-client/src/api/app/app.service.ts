import {Injectable} from '@angular/core'
import {AppState, AppStore} from './app.store'
import {Game} from '../game.service'

@Injectable({providedIn: 'root'})
export class AppService {

  constructor(private readonly appStore: AppStore) {
  }

  clear() {
    this.appStore.clear()
  }

  setForm(form: AppState) {
    this.appStore.setState(form)
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

  setBestOldGame(bestOldGame: Game) {
    this.appStore.setBestOldGame(bestOldGame)
  }

  setMostAnticipated(mostAnticipated: Game) {
    this.appStore.setMostAnticipated(mostAnticipated)
  }

  setEnteredGiveaway(enteredGiveaway: boolean) {
    this.appStore.setEnteredGiveaway(enteredGiveaway)
  }

}
