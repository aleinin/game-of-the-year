import {Component} from '@angular/core'
import {giveAway} from '../api/constants'
import {FormBuilder, Validators} from '@angular/forms'
import {AppQuery} from '../api/app/app.store'
import {SubmissionService} from '../api/submission.service'
import {first} from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  giveaway = giveAway
  form = this.formBuilder.group({
    name: ['', Validators.required],
    gameOfTheYear: [[], Validators.minLength(1)],
    oldGame: [undefined],
    mostAnticipated: [undefined],
    giveaway: [undefined, Validators.required] // todo giveaway constant false
  })

  constructor(private readonly appQuery: AppQuery,
              private readonly formBuilder: FormBuilder,
              private readonly submissionService: SubmissionService) {
    this.appQuery.select().subscribe((state) => {
      this.form.setValue({...state})
    })
  }

  submit() {
    this.submissionService.submit(this.form.getRawValue()).pipe(
      first()
    ).subscribe()
  }
}
