import {HttpHeaders} from '@angular/common/http'
import {of} from 'rxjs'

export const defaultHeaders = new HttpHeaders()
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json')


export const genericErrorHandler = (error: any, errorMessage?: string) => {
  if (errorMessage != null) {
    console.error(errorMessage)
  }
  console.error(error)
  return of(error)
}
