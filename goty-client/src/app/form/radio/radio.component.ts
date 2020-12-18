import {Component, forwardRef} from '@angular/core'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms'
import {giveAwayAmountUSD} from '../../../api/constants'

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {
  title = `Do you want to enter the drawing for the \$${giveAwayAmountUSD} steam gift card?`
  internalValue: any
  onChange: any = () => {
  }
  onTouch: any = () => {
  }

  set value(value: boolean) {
    if (value != null && value !== this.internalValue) {
      this.internalValue = value
      this.onChange(value)
      this.onTouch(value)
    }
  }

  get value() {
    return this.internalValue
  }

  constructor() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  writeValue(value: boolean): void {
    this.value = value
  }
}
