import {Query, Store, StoreConfig} from '@datorama/akita'
import {Injectable} from '@angular/core'

export interface SubmissionFlowState {
  step: SubmissionStep
}

export enum SubmissionStep {
  Start,
  Submission,
  End
}

export function createInitialState() {
  return {
    step: SubmissionStep.Start
  }
}

@StoreConfig({name: 'submissionFlow'})
@Injectable({providedIn: 'root'})
export class SubmissionFlowStore extends Store<SubmissionFlowState> {
  constructor() {
    super(createInitialState())
  }

  setStep(step: SubmissionStep) {
    this.update(() => ({step}))
  }
}

@Injectable({providedIn: 'root'})
export class SubmissionFlowQuery extends Query<SubmissionFlowState> {
  constructor(protected store: SubmissionFlowStore) {
    super(store)
  }
}
