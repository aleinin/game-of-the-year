import {HttpClient} from '@angular/common/http'
import {BehaviorSubject, of} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'

export interface Constants {
  tiePoints: number[],
  year: number,
  closeDate: string,
  lastTime: string,
  giveaway: boolean,
  giveawayAmountUSD: number,
  baseUrl: string
}

const constantsSubject = new BehaviorSubject<Constants | null>(null)
const checkType = <T>(a: any, b: T): a is T => typeof a === typeof b
const safeAccessor = <T>(prop: keyof Constants, defaultValue: T): T => {
  const constantsValue = constantsSubject.getValue()
  if (constantsValue == null) {
    return defaultValue
  }
  const value = constantsValue[prop]
  if (checkType(value, defaultValue)) {
    return value
  }
  return defaultValue
}

export const currentYear = () => new Date().getFullYear()
const defaultTiePoints = [
  15,
  13,
  11,
  7,
  6,
  5,
  4,
  3,
  2,
  1
]

export let constants: Constants = {
  get tiePoints() {
    return safeAccessor('tiePoints', defaultTiePoints)
  },
  get year() {
    return safeAccessor('year', currentYear())
  },
  get closeDate() {
    return safeAccessor('closeDate', `1/1/${this.year + 1}`)
  },
  get lastTime() {
    return safeAccessor('lastTime', `12/31/${this.year} 11:59PM`)
  },
  get giveaway() {
    return safeAccessor('giveaway', true)
  },
  get giveawayAmountUSD() {
    return safeAccessor('giveawayAmountUSD', 25)
  },
  get baseUrl() {
    return safeAccessor('baseUrl', 'https://goty.gorlah.com')
  }
}

export const initConstants = (httpClient: HttpClient) => {
  return () => httpClient.get<Constants>('assets/constants.json').pipe(
    first(),
    tap((constantsValue) => constantsSubject.next(constantsValue)),
    catchError(() => of(null))
  ).toPromise()
}
