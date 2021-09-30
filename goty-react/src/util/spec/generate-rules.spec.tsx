import React from 'react'
import { generateRules } from '../generate-rules'

it('should return an empty fragment if readonly', () => {
  const input = ['hello', <li>World</li>]
  const readonly = true
  expect(generateRules(readonly, input)).toEqual(
    <React.Fragment></React.Fragment>
  )
})

it('should create an li for strings and directly map <li>', () => {
  const input = ['hello', <li key="2">World</li>]
  const readonly = false
  expect(generateRules(readonly, input)).toEqual(
    <React.Fragment>
      <p>Rules:</p>
      <ul>
        <li key="0">hello</li>
        <li key="2">World</li>
      </ul>
    </React.Fragment>
  )
})
