import {Game} from '../game.service'
import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'

export interface Submission {
  submissionUUID: string
  name: string
  gamesOfTheYear: Game[]
  bestOldGame: Game | null,
  mostAnticipated: Game | null,
  enteredGiveaway: boolean | null
}

export function createInitialState(): Submission {
  return {
    submissionUUID: null,
    name: '',
    gamesOfTheYear: [],
    bestOldGame: null,
    mostAnticipated: null,
    enteredGiveaway: null
  }
}

@StoreConfig({name: 'submissionStore'})
@Injectable({providedIn: 'root'})
export class SubmissionStore extends Store<Submission> {
  constructor() {
    super(createInitialState())
  }

  clear() {
    this.update(() => createInitialState())
  }

  setState(state: Submission) {
    this.update( () => state)
  }

  setName(name: string) {
    this.update((state => ({...state, name})))
  }

  addGameToGOTY(newGame: Game) {
    this.update((state) => ({
      ...state,
      gamesOfTheYear: [
        ...state.gamesOfTheYear.filter((game) => game.id !== newGame.id),
        newGame
      ]
    }))
  }

  setGOTY(games: Game[]) {
    this.update((state) => ({...state, gamesOfTheYear: games}))
  }

  setBestOldGame(bestOldGame: Game) {
    this.update((state => ({...state, bestOldGame})))
  }

  setMostAnticipated(mostAnticipated: Game) {
    this.update((state => ({...state, mostAnticipated})))
  }

  setEnteredGiveaway(enteredGiveaway: boolean) {
    this.update((state => ({...state, enteredGiveaway})))
  }
}

@Injectable({providedIn: 'root'})
export class SubmissionQuery extends Query<Submission> {
  constructor(protected store: SubmissionStore) {
    super(store)
  }

  selectName() {
    return this.select('name')
  }

  selectGamesOfTheYear() {
    return this.select('gamesOfTheYear')
  }

  selectMostAnticipated() {
    return this.select('mostAnticipated')
  }

  selectBestOldGame() {
    return this.select('bestOldGame')
  }

  selectEnteredGiveaway() {
    return this.select('enteredGiveaway')
  }
}
