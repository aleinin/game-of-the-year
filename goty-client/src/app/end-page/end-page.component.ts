import {Component} from '@angular/core'
import {constants} from '../../api/constants'
import {Router} from '@angular/router'

@Component({
  selector: 'app-end-page',
  templateUrl: './end-page.component.html',
  styleUrls: ['./end-page.component.scss']
})
export class EndPageComponent {
  isError = false
  error: any
  closeDate = constants.closeDate
  constructor(private readonly router: Router) {
    this.isError = this.router.getCurrentNavigation().extras.state.isError
    this.error = this.router.getCurrentNavigation().extras.state.error
  }

}
