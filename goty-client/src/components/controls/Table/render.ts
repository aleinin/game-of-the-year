import { isValidElement, ReactNode } from 'react'
import { Primitive } from './Table.types'

export const render = (value: unknown): ReactNode => {
  const valueType = typeof value
  const isPrimitive = (value: unknown): value is Primitive =>
    valueType === 'string' || valueType === 'number' || valueType === 'boolean'
  if (isValidElement(value) || isPrimitive(value)) {
    return value
  }
  return ''
}
