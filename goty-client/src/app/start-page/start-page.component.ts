import {Component} from '@angular/core'
import {AppService} from '../../api/app/app.service'
import {Router} from '@angular/router'
import {AppStepService} from '../../api/app/app.step.service'
import {FormService} from '../../api/form.service'
import {catchError} from 'rxjs/operators'
import {of} from 'rxjs'

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
              private readonly appStepService: AppStepService,
              private readonly router: Router,
              private readonly formService: FormService) {
    this.appService.clear()
    const submissionUUID = localStorage.getItem('submissionUUID')
    this.hasSubmission = notNull(submissionUUID)
    if (this.hasSubmission) {
      this.formService.getForm(submissionUUID).pipe(
        catchError((error) => {
          this.hasSubmission = false
          console.error(error)
          if (error.status === 404 || error.status === 400) {
            // localStorage.removeItem('submissionUUID')
          }
          return of(error)
        })
      ).subscribe()
    }
  }

  route() {
    this.appStepService.setFormStep()
    this.router.navigate(['/form'])
  }
}
