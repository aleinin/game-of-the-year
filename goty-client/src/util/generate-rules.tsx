import React from 'react'

const isString = (val: any): val is string => typeof val === 'string'

export const generateRules = (
    readonly: boolean,
    rules: (string | JSX.Element)[]
) => {
    if (readonly) {
        return null
    }
    return (
        <>
            <p>Rules:</p>
            <ul>
                {rules.map((rule, index) =>
                    isString(rule) ? <li key={index}>{rule}</li> : rule
                )}
            </ul>
        </>
    )
}
