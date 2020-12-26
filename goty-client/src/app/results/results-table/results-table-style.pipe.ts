import { Pipe, PipeTransform } from '@angular/core'
import {StyleType} from './results-table.component'

const hasNoStyle = (rank: number, styleType: StyleType) =>
  styleType === 'none' || (styleType === 'goty' && rank > 3 && rank <= 10)

const missingRankAndOrStyleType = (rank: number, styleType: StyleType) =>
  rank == null || styleType === 'none'

@Pipe({
  name: 'resultsTableStylePipe'
})
export class ResultsTableStylePipe implements PipeTransform {
  transform(rank: number, styleType: StyleType): string {
    if (missingRankAndOrStyleType(rank, styleType) || hasNoStyle(rank, styleType)) {
      return ''
    }
    if ((styleType === 'single' && rank > 1) || (styleType === 'goty' && rank > 10)) {
      return 'ranked-eliminated'
    }
    switch (rank) {
      case 1:
        return 'ranked-first'
      case 2:
        return 'ranked-second'
      case 3:
        return 'ranked-third'
    }
    return ''
  }
}
