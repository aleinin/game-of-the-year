import {Component, Input} from '@angular/core'

export type StyleType = 'none' | 'goty' | 'single'

const isStringArray = (values: any[]): values is string[] => {
  return Array.isArray(values)
    && values.length > 0
    && values.every((value) => typeof value === 'string')
}

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent<T> {
  @Input() title = ''
  @Input()
  set rows(rows: T[]) {
    if (isStringArray(rows)) {
      this.stringArr = true
    }
    this.values = rows
  }
  @Input() columnConfig: Array<keyof T>
  @Input() styleType: StyleType = 'none'
  stringArr = false
  values: T[]
  constructor() { }
}
