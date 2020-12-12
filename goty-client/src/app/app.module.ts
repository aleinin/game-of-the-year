import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import {HttpClientModule} from '@angular/common/http'
import {DropdownModule} from 'primeng/dropdown'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {AutoCompleteModule} from 'primeng/autocomplete';
import { TitleComponent } from './title/title.component';
import { OrderableListComponent } from './orderable-list/orderable-list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { IndexToWordPipe } from './list-item/index-to-word.pipe';
import { GameOfTheYearComponent } from './game-of-the-year/game-of-the-year.component';
import { InfoComponent } from './info/info.component';
import { OldGameComponent } from './old-game/old-game.component';
import { MostAnticipatedComponent } from './most-anticipated/most-anticipated.component';
import { GiveawayComponent } from './giveaway/giveaway.component';
import { SearchInPlaceComponent } from './search-in-place/search-in-place.component';
import { RadioComponent } from './radio/radio.component'
import {RadioButtonModule} from 'primeng/radiobutton'
import {ButtonModule} from 'primeng/button';
import { SearchComponent } from './search/search.component'
import {InputTextModule} from 'primeng/inputtext';
import { SingleGameComponent } from './single-game/single-game.component'

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
    SingleGameComponent
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
    InputTextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
