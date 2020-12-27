import {Injectable} from '@angular/core'
import {Game} from '../game.service'
import {Submission, SubmissionStore} from './submission.store'

@Injectable({providedIn: 'root'})
export class SubmissionService {

  constructor(private readonly submissionStore: SubmissionStore) {
  }

  clear() {
    this.submissionStore.clear()
  }

  setSubmission(submission: Submission) {
    this.submissionStore.setState(submission)
  }

  setName(name: string) {
    this.submissionStore.setName(name)
  }

  addGameToGOTY(game: Game) {
     this.submissionStore.addGameToGOTY(game)
  }

  setGOTY(games: Game[]) {
    this.submissionStore.setGOTY(games)
  }

  setBestOldGame(bestOldGame: Game) {
    this.submissionStore.setBestOldGame(bestOldGame)
  }

  setMostAnticipated(mostAnticipated: Game) {
    this.submissionStore.setMostAnticipated(mostAnticipated)
  }

  setEnteredGiveaway(enteredGiveaway: boolean) {
    this.submissionStore.setEnteredGiveaway(enteredGiveaway)
  }

}
