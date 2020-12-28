import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {StartPageComponent} from './start-page/start-page.component'
import {EndPageComponent} from './end-page/end-page.component'
import {RecoveryComponent} from './recovery/recovery.component'
import {ResultsComponent} from './results/results.component'
import {ResultsSubmissionComponent} from './results/results-submission/results-submission.component'
import {ResultsSummaryComponent} from './results/results-summary/results-summary.component'
import {SubmissionComponent} from './submission/submission.component'
import {SubmissionFlowGuard} from '../api/submission-flow/submission-flow.guard'
import {SubmissionStep} from '../api/submission-flow/submission-flow.store'

const routes: Routes = [
  {
    path: 'start',
    component: StartPageComponent
  },
  {
    path: 'submission',
    component: SubmissionComponent,
    canActivate: [SubmissionFlowGuard],
    data: { attemptingToAccess: SubmissionStep.Submission }
  },
  {
    path: 'end',
    component: EndPageComponent,
    canActivate: [SubmissionFlowGuard],
    data: { attemptingToAccess: SubmissionStep.End }
  },
  {
    path: 'recovery',
    component: RecoveryComponent
  },
  {
    path: 'results', // TODO GUARD,
    component: ResultsComponent,
    children: [
      {
        path: 'summary',
        component: ResultsSummaryComponent
      },
      {
        path: 'individual',
        component: ResultsSubmissionComponent
      },
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'start',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
