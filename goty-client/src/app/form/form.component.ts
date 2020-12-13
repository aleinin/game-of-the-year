import { Component} from '@angular/core'
import {giveAway} from '../../api/constants'
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms'
import {AppQuery, AppState} from '../../api/app/app.store'
import {FormService} from '../../api/form.service'
import {first} from 'rxjs/operators'
import {Router} from '@angular/router'
import {AppStepService} from '../../api/app/app.step.service'

export const giveawayRequired = (control: AbstractControl): ValidationErrors | null =>
  giveAway ? Validators.required(control) : null

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  giveaway = giveAway
  form = this.formBuilder.group({
    submissionUUID: [undefined],
    name: ['', Validators.required],
    gamesOfTheYear: [[], Validators.minLength(1)],
    bestOldGame: [undefined],
    mostAnticipated: [undefined],
    enteredGiveaway: [undefined, giveawayRequired]
  })

  constructor(private readonly appQuery: AppQuery,
              private readonly formBuilder: FormBuilder,
              private readonly submissionService: FormService,
              private readonly router: Router,
              private readonly appStepService: AppStepService) {
    this.appQuery.select().subscribe((state) => {
      this.form.setValue({...state})
    })
  }

  submit() {
    const state: AppState = this.form.getRawValue()
    if (state.submissionUUID != null) {
      this.submissionService.updateForm(state).pipe(
        first(),
      ).subscribe((result) => {
        this.routeToEnd(result)
      })
    } else {
      this.submissionService.submitNewForm(state).pipe(
        first()
      ).subscribe((result) => {
        this.routeToEnd(result)
      })
    }
  }

  private routeToEnd(result: any) {
    this.appStepService.setEndStep()
    const isError = result.error != null
    let error
    if (isError) {
      error = JSON.stringify(result)
    }
    this.router.navigate(['/end'], {state: {isError, error}})
  }
}


