import {Component, Input, OnInit} from '@angular/core'
import {GameOfTheYearResult, GameResult} from '../../../api/results/results.store'

const isStringArray = (values: any[]): values is string[] => {
  return Array.isArray(values)
    && values.length > 0
    && values.every((value) => typeof value === 'string')
}
type SomeResult = string | GameResult | GameOfTheYearResult

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent<T> {
  @Input() title = ''
  @Input()
  set rows(rows: SomeResult[]) {
    if (isStringArray(rows)) {
      this.values = rows
      this.stringArr = true
    } else {
      this.values = rows
    }
  }
  @Input() columnConfig: Array<keyof T>
  stringArr = false
  values: SomeResult[]
  constructor() { }
}
