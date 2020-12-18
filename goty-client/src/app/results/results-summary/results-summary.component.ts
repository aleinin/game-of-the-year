import { Component, OnInit } from '@angular/core'
import {year} from '../../../api/constants'
import {GameOfTheYearResult, GameResult, ResultsQuery} from '../../../api/results/results.store'

@Component({
  selector: 'app-results-summary',
  templateUrl: './results-summary.component.html',
  styleUrls: ['./results-summary.component.scss']
})
export class ResultsSummaryComponent {
  readonly oldGameTitle = `Old Game of ${year}`
  readonly gameOfTheYearColumns: Array<keyof GameOfTheYearResult> = ['rank', 'title', 'votes', 'points']
  readonly gameColumns: Array<keyof GameResult> = ['rank', 'title', 'votes']
  names$ = this.resultsQuery.selectResult('names')
  gamesOfTheYear$ = this.resultsQuery.selectResult('gamesOfTheYear')
  bestOldGames$ = this.resultsQuery.selectResult('bestOldGame')
  mostAnticipated$ = this.resultsQuery.selectResult('mostAnticipated')
  giveaway$ = this.resultsQuery.selectResult('giveaway')
  submissions$ = this.resultsQuery.selectSubmissions()
  constructor(private readonly resultsQuery: ResultsQuery) { }
}
