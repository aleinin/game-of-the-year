import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import {HttpClientModule} from '@angular/common/http'
import {DropdownModule} from 'primeng/dropdown'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {AutoCompleteModule} from 'primeng/autocomplete'
import { TitleComponent } from './form/title/title.component'
import { OrderableListComponent } from './form/orderable-list/orderable-list.component'
import { ListItemComponent } from './form/list-item/list-item.component'
import { IndexToWordPipe } from './form/list-item/index-to-word.pipe'
import { GameOfTheYearComponent } from './form/game-of-the-year/game-of-the-year.component'
import { InfoComponent } from './form/info/info.component'
import { OldGameComponent } from './form/old-game/old-game.component'
import { MostAnticipatedComponent } from './form/most-anticipated/most-anticipated.component'
import { GiveawayComponent } from './form/giveaway/giveaway.component'
import { SearchInPlaceComponent } from './form/search-in-place/search-in-place.component'
import { RadioComponent } from './form/radio/radio.component'
import {RadioButtonModule} from 'primeng/radiobutton'
import {ButtonModule} from 'primeng/button'
import { SearchComponent } from './form/search/search.component'
import {InputTextModule} from 'primeng/inputtext'
import { SingleGameComponent } from './form/single-game/single-game.component'
import { StartPageComponent } from './start-page/start-page.component'
import { FormComponent } from './form/form.component'
import { EndPageComponent } from './end-page/end-page.component'
import { RecoveryComponent } from './recovery/recovery.component'
import { ResultsComponent } from './results/results.component'
import {TabViewModule} from 'primeng/tabview'
import {TableModule} from 'primeng/table'
import { ResultsTableComponent } from './results/results-table/results-table.component'
import { ResultsSubmissionComponent } from './results/results-submission/results-submission.component'
import { ResultsSummaryComponent } from './results/results-summary/results-summary.component'
import {PaginatorComponent} from './results/paginator/paginator.component'

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
        FormComponent,
        EndPageComponent,
        RecoveryComponent,
        ResultsComponent,
        ResultsTableComponent,
        ResultsSubmissionComponent,
        ResultsSummaryComponent,
        PaginatorComponent
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
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
