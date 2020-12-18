import {Component} from '@angular/core'
import {AppService} from '../../api/app/app.service'
import {Router} from '@angular/router'
import {SubmissionService} from '../../api/submission.service'
import {catchError} from 'rxjs/operators'
import {of} from 'rxjs'
import {UIService} from '../../api/ui/ui.service'

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
  constructor(private readonly appService: AppService,
              private readonly uiService: UIService,
              private readonly router: Router,
              private readonly formService: SubmissionService) {
    this.appService.clear()
    const submissionUUID = localStorage.getItem('submissionUUID')
    this.hasSubmission = notNull(submissionUUID)
    if (this.hasSubmission) {
      this.formService.getSubmission(submissionUUID).pipe(
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
    this.uiService.advanceToForm()
  }
}
