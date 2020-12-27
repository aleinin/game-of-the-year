import {Component, EventEmitter, Input, Output} from '@angular/core'

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {
  pageIndex = 0
  @Input() totalPages = 0
  @Output() pageChange = new EventEmitter<number>()
  constructor() {
  }

  left() {
    const nextPage = this.pageIndex - 1
    this.pageIndex = nextPage >= 0 ? nextPage : 0
    this.pageChange.emit(this.pageIndex)
  }

  jumpLeft() {
    this.pageIndex = 0
    this.pageChange.emit(this.pageIndex)
  }

  right() {
    const nextPage = this.pageIndex + 1
    this.pageIndex = nextPage <= (this.totalPages - 1) ? nextPage : this.totalPages - 1
    this.pageChange.emit(this.pageIndex)
  }

  jumpRight() {
    this.pageIndex = this.totalPages - 1
    this.pageChange.emit(this.pageIndex)
  }
}
