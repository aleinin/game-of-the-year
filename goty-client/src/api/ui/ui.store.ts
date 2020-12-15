import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'

export interface UIState {
  step: UIStep
}

export enum UIStep {
  Start,
  Form,
  End
}

export function createInitialState() {
  return {
    step: UIStep.Start
  }
}

@StoreConfig({name: 'appStep'})
@Injectable({providedIn: 'root'})
export class UIStore extends Store<UIState> {
  constructor() {
    super(createInitialState())
  }

  setStep(step: UIStep) {
    this.update(() => ({step}))
  }
}

@Injectable({providedIn: 'root'})
export class UIQuery extends Query<UIState> {
  constructor(protected store: UIStore) {
    super(store)
  }
}
