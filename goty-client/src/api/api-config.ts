import {HttpHeaders} from '@angular/common/http'

export const defaultHeaders = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json')
