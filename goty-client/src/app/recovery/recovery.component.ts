import {Component} from '@angular/core'
import {FormBuilder, Validators} from '@angular/forms'
import {FormService} from '../../api/form.service'
import {first, tap} from 'rxjs/operators'
import {genericErrorHandler} from '../../api/api-config'
import {Router} from '@angular/router'
import {UIService} from '../../api/ui/ui.service'

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
              private readonly formService: FormService,
              private readonly uiService: UIService,
              private readonly router: Router) {

  }

  submit() {
    this.failed = false
    const uuid = this.recoveryForm.getRawValue().uuid
    this.formService.getForm(uuid).pipe(
      first(),
      tap(() => {
        localStorage.setItem('submissionUUID', uuid)
        this.uiService.advanceToForm()
      }, (error) => {
        this.failed = true
        return genericErrorHandler(error, 'Failed to get submission')
      })
    ).subscribe()
  }
}
