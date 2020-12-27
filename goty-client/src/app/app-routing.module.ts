import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import {StartPageComponent} from './start-page/start-page.component'
import {EndPageComponent} from './end-page/end-page.component'
import {EndGuard, FormGuard} from '../api/ui/ui.guard'
import {RecoveryComponent} from './recovery/recovery.component'
import {ResultsComponent} from './results/results.component'
import {ResultsSubmissionComponent} from './results/results-submission/results-submission.component'
import {ResultsSummaryComponent} from './results/results-summary/results-summary.component'
import {SubmissionComponent} from './submission/submission.component'

const routes: Routes = [
  {
    path: 'start',
    component: StartPageComponent
  },
  {
    path: 'form',
    component: SubmissionComponent,
    canActivate: [FormGuard]
  },
  {
    path: 'end',
    component: EndPageComponent,
    canActivate: [EndGuard]
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
export class AppRoutingModule { }
