import {Injectable} from '@angular/core'
import {UIStep, UIStore} from './ui.store'
import {Router} from '@angular/router'

@Injectable({'providedIn': 'root'})
export class UIService {

  constructor(private readonly uiStore: UIStore,
              private readonly router: Router) {
  }
  returnToStart() {
    this.uiStore.setStep(UIStep.Start)
    this.router.navigate(['/start'])
  }

  advanceToForm() {
    this.uiStore.setStep(UIStep.Form)
    this.router.navigate(['/form'])
  }

  advanceToEnd(error?: any) {
    let extras = {state: {isError: error != null, error}}
    this.uiStore.setStep(UIStep.End)
    this.router.navigate(['/end'], extras)
  }
}
