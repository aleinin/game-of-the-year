import React from "react"

const isString = (val: any): val is string => typeof val === "string"

export const generateRules = (
  readonly: boolean,
  rules: (string | JSX.Element)[]
) => {
  return readonly ? (
    <React.Fragment />
  ) : (
    <React.Fragment>
      <p>Rules:</p>
      <ul>
        {rules.map((rule, index) =>
          isString(rule) ? <li key={index}>{rule}</li> : rule
        )}
      </ul>
    </React.Fragment>
  )
}
