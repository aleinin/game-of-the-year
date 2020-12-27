import { Pipe, PipeTransform } from '@angular/core'
import {StyleType} from './results-table.component'

const first = 0
const second = 1
const third = 2
const tenth = 9

const isEliminated = (rank: number, styleType: StyleType) =>
  (styleType === 'single' && rank > first) || (styleType === 'goty' && rank > tenth)

@Pipe({
  name: 'resultsTableStylePipe'
})
export class ResultsTableStylePipe implements PipeTransform {
  transform(rank: number, styleType: StyleType): string {
    if (isEliminated(rank, styleType)) {
      return 'ranked-eliminated'
    }
    switch (rank) {
      case first:
        return 'ranked-first'
      case second:
        return 'ranked-second'
      case third:
        return 'ranked-third'
    }
    return ''
  }
}
