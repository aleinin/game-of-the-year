import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {catchError} from 'rxjs/operators'
import {of} from 'rxjs'
import {SubmissionService} from '../../api/submission/submission.service'
import {SubmissionHttpService} from '../../api/submission/submission-http.service'
import {SubmissionFlowService} from '../../api/submission-flow/submission-flow.service'

const notNull = (input: string | null | undefined): input is string => {
  return input != null
   && input !== 'undefined'
   && input !== 'null'
}

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent {
  hasSubmission: boolean
  constructor(private readonly submissionService: SubmissionService,
              private readonly submissionFlowService: SubmissionFlowService,
              private readonly router: Router,
              private readonly submissionHttpService: SubmissionHttpService) {
    this.submissionService.clear()
    const submissionUUID = localStorage.getItem('submissionUUID')
    this.hasSubmission = notNull(submissionUUID)
    if (this.hasSubmission) {
      this.submissionHttpService.getSubmission(submissionUUID).pipe(
        catchError((error) => {
          this.hasSubmission = false
          console.error(error)
          if (error.status === 404 || error.status === 400) {
            localStorage.removeItem('submissionUUID')
          }
          return of(error)
        })
      ).subscribe()
    }
  }

  route() {
    this.submissionFlowService.advanceToSubmission()
  }
}
