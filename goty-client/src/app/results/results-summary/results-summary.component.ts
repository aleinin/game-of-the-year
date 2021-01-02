import {Component} from '@angular/core'
import {constants} from '../../../api/constants'
import {GameOfTheYearResult, GameResult, ResultsQuery} from '../../../api/results/results.store'
import {ResultsService} from '../../../api/results/results.service'
import {filter, first, switchMap} from 'rxjs/operators'

@Component({
  selector: 'app-results-summary',
  templateUrl: './results-summary.component.html',
  styleUrls: ['./results-summary.component.scss']
})
export class ResultsSummaryComponent {
  readonly oldGameTitle = `Old Game of ${constants.year}`
  readonly gameOfTheYearColumns: Array<keyof GameOfTheYearResult> = ['rank', 'title', 'votes', 'points']
  readonly gameColumns: Array<keyof GameResult> = ['rank', 'title', 'votes']
  names$ = this.resultsQuery.selectResults('participants')
  gamesOfTheYear$ = this.resultsQuery.selectResults('gamesOfTheYear')
  bestOldGames$ = this.resultsQuery.selectResults('bestOldGame')
  mostAnticipated$ = this.resultsQuery.selectResults('mostAnticipated')
  giveaway$ = this.resultsQuery.selectResults('giveawayParticipants')
  loading$ = this.resultsQuery.selectLoading()

  constructor(private readonly resultsQuery: ResultsQuery,
              private readonly resultsService: ResultsService) {
    this.resultsQuery.selectHasResults().pipe(
      first(),
      filter((hasResults) => !hasResults),
      switchMap(() => this.resultsService.fetchResults())
    ).subscribe()
  }
}
