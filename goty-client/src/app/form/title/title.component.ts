import {Component} from '@angular/core'
import {year} from 'src/api/constants'

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {
  year = year

  constructor() {
  }
}
