import {Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {AppStep, AppStepQuery} from './app.step.store'
import {map} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class FormGuard implements CanActivate {
  constructor(private readonly appStepQuery: AppStepQuery,
              private readonly guard: GenericGuard) {
  }

  canActivate() {
    return this.appStepQuery.select().pipe(
      map(({step}) => this.guard.canActivate(step, AppStep.Form))
    )
  }
}

@Injectable({providedIn: 'root'})
export class EndGuard implements CanActivate {
  constructor(private readonly appStepQuery: AppStepQuery,
              private readonly guard: GenericGuard) {
  }

  canActivate() {
    return this.appStepQuery.select().pipe(
      map(({step}) => this.guard.canActivate(step, AppStep.End))
    )
  }
}

@Injectable({providedIn: 'root'})
export class GenericGuard {
  constructor(private readonly router: Router) {

  }
  canActivate(appStep: AppStep, attemptingToAccess: AppStep) {
    if (appStep !== attemptingToAccess) {
      this.router.navigateByUrl('/start')
      return false
    }
    return true
  }
}
