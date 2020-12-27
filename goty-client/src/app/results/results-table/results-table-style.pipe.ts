import { Pipe, PipeTransform } from '@angular/core'
import {StyleType} from './results-table.component'

const first = 0
const second = 1
const third = 2
const tenth = 9

const isInGOTYTop10ButNotTop3 = (rank: number, styleType: StyleType) =>
  (styleType === 'goty' && rank > third && rank <= tenth)

const isMissingRankAndOrStyleType = (rank: number, styleType: StyleType) =>
  rank == null || styleType === 'none'

@Pipe({
  name: 'resultsTableStylePipe'
})
export class ResultsTableStylePipe implements PipeTransform {
  transform(rank: number, styleType: StyleType): string {
    if (isMissingRankAndOrStyleType(rank, styleType) || isInGOTYTop10ButNotTop3(rank, styleType)) {
      return ''
    }
    if ((styleType === 'single' && rank > first) || (styleType === 'goty' && rank > tenth)) {
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
