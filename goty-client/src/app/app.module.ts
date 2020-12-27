import { BrowserModule } from '@angular/platform-browser'
import {APP_INITIALIZER, NgModule} from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import {HttpClient, HttpClientModule} from '@angular/common/http'
import {DropdownModule} from 'primeng/dropdown'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {AutoCompleteModule} from 'primeng/autocomplete'
import { TitleComponent } from './submission/title/title.component'
import { OrderableListComponent } from './submission/orderable-list/orderable-list.component'
import { ListItemComponent } from './submission/list-item/list-item.component'
import { IndexToWordPipe } from './submission/list-item/index-to-word.pipe'
import { GameOfTheYearComponent } from './submission/game-of-the-year/game-of-the-year.component'
import { InfoComponent } from './submission/info/info.component'
import { OldGameComponent } from './submission/old-game/old-game.component'
import { MostAnticipatedComponent } from './submission/most-anticipated/most-anticipated.component'
import { GiveawayComponent } from './submission/giveaway/giveaway.component'
import { SearchInPlaceComponent } from './submission/search-in-place/search-in-place.component'
import { RadioComponent } from './submission/radio/radio.component'
import {RadioButtonModule} from 'primeng/radiobutton'
import {ButtonModule} from 'primeng/button'
import { SearchComponent } from './submission/search/search.component'
import {InputTextModule} from 'primeng/inputtext'
import { SingleGameComponent } from './submission/single-game/single-game.component'
import { StartPageComponent } from './start-page/start-page.component'
import { EndPageComponent } from './end-page/end-page.component'
import { RecoveryComponent } from './recovery/recovery.component'
import { ResultsComponent } from './results/results.component'
import {TabViewModule} from 'primeng/tabview'
import {TableModule} from 'primeng/table'
import { ResultsTableComponent } from './results/results-table/results-table.component'
import { ResultsSubmissionComponent } from './results/results-submission/results-submission.component'
import { ResultsSummaryComponent } from './results/results-summary/results-summary.component'
import {ProgressSpinnerModule} from 'primeng/progressspinner'
import {ResultsTableStylePipe} from './results/results-table/results-table-style.pipe'
import {LoadingComponent} from './results/loading/loading.component'
import {SubmissionComponent} from './submission/submission.component'
import {PaginatorComponent} from './results/paginator/paginator.component'
import {initConstants} from '../api/constants'

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    OrderableListComponent,
    ListItemComponent,
    IndexToWordPipe,
    GameOfTheYearComponent,
    InfoComponent,
    OldGameComponent,
    MostAnticipatedComponent,
    GiveawayComponent,
    SearchInPlaceComponent,
    RadioComponent,
    SearchComponent,
    SingleGameComponent,
    StartPageComponent,
    SubmissionComponent,
    EndPageComponent,
    RecoveryComponent,
    ResultsComponent,
    ResultsTableComponent,
    ResultsSubmissionComponent,
    ResultsSummaryComponent,
    PaginatorComponent,
    ResultsTableStylePipe,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    RadioButtonModule,
    ButtonModule,
    InputTextModule,
    TabViewModule,
    TableModule,
    ProgressSpinnerModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConstants,
      deps: [HttpClient],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
