import {Component, Input} from '@angular/core'

const logErrorIfFalse = (bool: boolean, error: string) => {
  if (!bool) {
    console.error(error)
  }
  return bool
}

const validFontSize = (inputFontSize: string) => {
  const range = {
    px: {min: 20, max: 60},
    em: {min: 1, max: 3}
  }
  const validFontType = (fontSize: string) => {
    const validType = /^\d+(em|px)$/.test(fontSize)
    return logErrorIfFalse(validType, 'Font size must be expressed in em or px')
  }
  const validFontNumber = (fontSize: string) => {
    const num = parseInt(fontSize.match(/^\d+/)[0], 10)
    const type = fontSize.match(/[a-z]{2}$/)[0]
    const validNumber = num >= range[type].min && num <= range[type].max
    return logErrorIfFalse(validNumber, `Size must be between ${range.em.min}-${range.em.max}em or ${range.px.min}-${range.px.max}px`)
  }
  return validFontType(inputFontSize) && validFontNumber(inputFontSize)
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title = ''
  @Input() subtitle
  @Input() required = false
  @Input() set titleFontSize(titleFontSize: string) {
    if (validFontSize(titleFontSize)) {
      this.internalStyle = {
        'font-size': titleFontSize,
        'font-weight': 'bold'
      }
    }
  }
  internalStyle: {[cssClass: string]: any} = {'font-size': '20px', 'font-weight': 'bold'}
}
