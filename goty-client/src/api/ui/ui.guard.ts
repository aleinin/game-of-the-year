import {Injectable} from '@angular/core'
import {CanActivate} from '@angular/router'
import {map} from 'rxjs/operators'
import {UIQuery, UIStep} from './ui.store'
import {UIService} from './ui.service'

@Injectable({providedIn: 'root'})
export class FormGuard implements CanActivate {
  constructor(private readonly uiQuery: UIQuery,
              private readonly guard: GenericGuard) {
  }

  canActivate() {
    return this.uiQuery.select().pipe(
      map(({step}) => this.guard.canActivate(step, UIStep.Form))
    )
  }
}

@Injectable({providedIn: 'root'})
export class EndGuard implements CanActivate {
  constructor(private readonly uiQuery: UIQuery,
              private readonly guard: GenericGuard) {
  }

  canActivate() {
    return this.uiQuery.select().pipe(
      map(({step}) => this.guard.canActivate(step, UIStep.End))
    )
  }
}

@Injectable({providedIn: 'root'})
export class GenericGuard {
  constructor(private readonly uiService: UIService) {

  }
  canActivate(step: UIStep, attemptingToAccess: UIStep) {
    if (step !== attemptingToAccess) {
      this.uiService.returnToStart()
      return false
    }
    return true
  }
}
