import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'

export interface AppStepState {
  step: AppStep
}

export enum AppStep {
  Start,
  Form,
  End
}

export function createInitialState() {
  return {
    step: AppStep.Start
  }
}

@StoreConfig({name: 'appStep'})
@Injectable({providedIn: 'root'})
export class AppStepStore extends Store<AppStepState> {
  constructor() {
    super(createInitialState())
  }

  setStep(step: AppStep) {
    this.update(() => ({step}))
  }
}

@Injectable({providedIn: 'root'})
export class AppStepQuery extends Query<AppStepState> {
  constructor(protected store: AppStepStore) {
    super(store)
  }
}
