import {Injectable} from '@angular/core'
import {Game} from '../game.service'
import {Submission, SubmissionStore} from './submission.store'

@Injectable({providedIn: 'root'})
export class SubmissionService {

  constructor(private readonly appStore: SubmissionStore) {
  }

  clear() {
    this.appStore.clear()
  }

  setForm(form: Submission) {
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
