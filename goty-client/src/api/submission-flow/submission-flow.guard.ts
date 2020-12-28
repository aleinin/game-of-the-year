import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot} from '@angular/router'
import {first, map, tap} from 'rxjs/operators'
import {SubmissionFlowService} from './submission-flow.service'
import {SubmissionFlowQuery} from './submission-flow.store'

@Injectable({providedIn: 'root'})
export class SubmissionFlowGuard {
  constructor(private readonly submissionFlowService: SubmissionFlowService,
              private readonly submissionFlowQuery: SubmissionFlowQuery) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const attemptingToAccess = route.data.attemptingToAccess
    return this.submissionFlowQuery.select().pipe(
      first(),
      map(({step}) => attemptingToAccess === step),
      tap((canActivate) => {
        if (!canActivate) {
          this.submissionFlowService.returnToStart()
        }
      })
    )
  }
}
