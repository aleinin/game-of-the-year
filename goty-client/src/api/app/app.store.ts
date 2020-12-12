import {Game} from '../game.service'
import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'

export interface AppState {
  name: string
  gameOfTheYear: Game[]
  oldGame: Game | null,
  mostAnticipated: Game | null,
  giveaway: boolean | null
}

export function createInitialState(): AppState {
  return {
    name: '',
    gameOfTheYear: [],
    oldGame: null,
    mostAnticipated: null,
    giveaway: null
  }
}

@StoreConfig({name: 'appStore'})
@Injectable({providedIn: 'root'})
export class AppStore extends Store<AppState> {
  constructor() {
    super(createInitialState())
  }

  setName(name: string) {
    this.update((state => ({...state, name})))
  }

  addGameToGOTY(newGame: Game) {
    this.update((state) => ({
      ...state,
      gameOfTheYear: [
        ...state.gameOfTheYear.filter((game) => game.id !== newGame.id),
        newGame
      ]
    }))
  }

  setGOTY(games: Game[]) {
    this.update((state) => ({...state, gameOfTheYear: games}))
  }

  setOldGame(oldGame: Game) {
    this.update((state => ({...state, oldGame})))
  }

  setMostAnticipated(mostAnticipated: Game) {
    this.update((state => ({...state, mostAnticipated})))
  }

  setGiveaway(giveaway: boolean) {
    this.update((state => ({...state, giveaway})))
  }
}

@Injectable({providedIn: 'root'})
export class AppQuery extends Query<AppState> {
  constructor(protected store: AppStore) {
    super(store)
  }

  selectName() {
    return this.select('name')
  }

  selectGameOfTheYear() {
    return this.select('gameOfTheYear')
  }

  selectMostAnticipated() {
    return this.select('mostAnticipated')
  }

  selectOldGame() {
    return this.select('oldGame')
  }

  selectGiveaway() {
    return this.select('giveaway')
  }
}
