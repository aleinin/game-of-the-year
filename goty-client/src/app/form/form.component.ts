import { Component} from '@angular/core'
import {giveAway} from '../../api/constants'
import {AbstractControl, FormBuilder, ValidationErrors, Validators} from '@angular/forms'
import {first} from 'rxjs/operators'
import {Router} from '@angular/router'
import {UIService} from '../../api/ui/ui.service'
import {Submission, SubmissionQuery} from '../../api/submission/submission.store'
import {SubmissionHttpService} from '../../api/submission/submission-http.service'

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
    gamesOfTheYear: [[], Validators.compose([Validators.required, Validators.minLength(1)])],
    bestOldGame: [undefined],
    mostAnticipated: [undefined],
    enteredGiveaway: [undefined, giveawayRequired]
  })
  name$ = this.submissionQuery.selectName()
  gamesOfTheYear$ = this.submissionQuery.selectGamesOfTheYear()
  bestOldGame$ = this.submissionQuery.selectBestOldGame()
  mostAnticipated$ = this.submissionQuery.selectMostAnticipated()
  enteredGiveaway$ = this.submissionQuery.selectEnteredGiveaway()
  constructor(private readonly submissionQuery: SubmissionQuery,
              private readonly formBuilder: FormBuilder,
              private readonly submissionHttpService: SubmissionHttpService,
              private readonly router: Router,
              private readonly uiService: UIService) {
    this.submissionQuery.select().subscribe((state) => {
      this.form.setValue({...state})
    })
  }

  submit() {
    const state: Submission = this.form.getRawValue()
    if (state.submissionUUID != null) {
      this.submissionHttpService.updateSubmission(state).pipe(
        first(),
      ).subscribe((result) => {
        this.routeToEnd(result)
      })
    } else {
      this.submissionHttpService.createSubmission(state).pipe(
        first()
      ).subscribe((result) => {
        this.routeToEnd(result)
      })
    }
  }

  private routeToEnd(result: any) {
    const isError = result.error != null
    let error
    if (isError) {
      error = JSON.stringify(result)
    }
    this.uiService.advanceToEnd(error)
  }
}


