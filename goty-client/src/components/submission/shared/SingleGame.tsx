import React from 'react'
import { Card } from '../../controls/Card/Card'
import { SearchInPlace } from '../../controls/SearchInPlace/SearchInPlace'
import { Game } from '../../../models/game'
import { Rules } from '../Rules'

export interface SingleGameProps {
  title: string
  subtitle?: string
  rules: string[]
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
}

export const SingleGame = (props: SingleGameProps) => {
  return (
    <Card title={props.title}>
      {props.subtitle && <span>{props.subtitle}</span>}
      <Rules readonly={props.readonly} rules={props.rules} />
      <SearchInPlace
        readonly={props.readonly}
        placeholder="Select a game"
        game={props.game}
        handleSelect={props.handleSelect}
      />
    </Card>
  )
}
