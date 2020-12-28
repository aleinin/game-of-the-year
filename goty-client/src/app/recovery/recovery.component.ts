import {Component} from '@angular/core'
import {FormBuilder, Validators} from '@angular/forms'
import {first, tap} from 'rxjs/operators'
import {genericErrorHandler} from '../../api/api-config'
import {SubmissionHttpService} from '../../api/submission/submission-http.service'
import {SubmissionFlowService} from '../../api/submission-flow/submission-flow.service'

const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent {
  failed = false
  recoveryForm = this.formBuilder.group({
    uuid: ['', [Validators.compose([Validators.required, Validators.pattern(uuidPattern)])]]
  })

  constructor(private readonly formBuilder: FormBuilder,
              private readonly submissionHttpService: SubmissionHttpService,
              private readonly submissionFlowService: SubmissionFlowService) {

  }

  submit() {
    this.failed = false
    const uuid = this.recoveryForm.getRawValue().uuid
    this.submissionHttpService.getSubmission(uuid).pipe(
      first(),
      tap(() => {
        localStorage.setItem('submissionUUID', uuid)
        this.submissionFlowService.advanceToSubmission()
      }, (error) => {
        this.failed = true
        return genericErrorHandler(error, 'Failed to get submission')
      })
    ).subscribe()
  }
}
