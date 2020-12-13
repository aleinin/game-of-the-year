import {Injectable} from '@angular/core'
import {AppStep, AppStepStore} from './app.step.store'

@Injectable({'providedIn': 'root'})
export class AppStepService {

  constructor(private readonly appStepStore: AppStepStore) {
  }

  setFormStep() {
    this.appStepStore.setStep(AppStep.Form)
  }

  setEndStep() {
    this.appStepStore.setStep(AppStep.End)
  }
}
