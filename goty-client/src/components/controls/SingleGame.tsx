import React from 'react'
import { SearchInPlace } from './SearchInPlace/SearchInPlace'
import { Rules } from '../submission/Rules'
import { Card } from './Card/Card'
import { Game } from '../../models/game'

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
