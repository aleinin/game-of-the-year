import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'indexToWord'
})
export class IndexToWordPipe implements PipeTransform {

  transform(index: number): string {
    if (index > 9) {
      console.error('unsupported number. supported numbers are between 1-10')
    }
    switch (index) {
      case 0:
        return '1st'
      case 1:
        return '2nd'
      case 2:
        return '3rd'
      default:
        return `${index + 1}th`
    }
  }

}
