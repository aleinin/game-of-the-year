import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import {StartPageComponent} from './start-page/start-page.component'
import {FormComponent} from './form/form.component'
import {EndPageComponent} from './end-page/end-page.component'
import {EndGuard, FormGuard} from '../api/ui/ui.guard'
import {RecoveryComponent} from './recovery/recovery.component'

const routes: Routes = [
  {
    path: 'start',
    component: StartPageComponent
  },
  {
    path: 'form',
    component: FormComponent,
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
