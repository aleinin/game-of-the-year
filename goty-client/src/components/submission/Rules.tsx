import React from 'react'

interface RulesProps {
  readonly: boolean
  rules: string[]
}

export const Rules = ({ readonly, rules }: RulesProps) => {
  if (readonly) {
    return null
  }
  return (
    <>
      <p>Rules:</p>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </>
  )
}
