import {Injectable} from '@angular/core'
import {Router} from '@angular/router'
import {SubmissionFlowStore, SubmissionStep} from './submission-flow.store'

@Injectable({providedIn: 'root'})
export class SubmissionFlowService {

  constructor(private readonly uiStore: SubmissionFlowStore,
              private readonly router: Router) {
  }
  returnToStart() {
    this.uiStore.setStep(SubmissionStep.Start)
    this.router.navigate(['/start'])
  }

  advanceToSubmission() {
    this.uiStore.setStep(SubmissionStep.Submission)
    this.router.navigate(['/submission'])
  }

  advanceToEnd(error?: any) {
    const extras = {state: {isError: error != null, error}}
    this.uiStore.setStep(SubmissionStep.End)
    this.router.navigate(['/end'], extras)
  }
}
