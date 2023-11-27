import React from 'react'
import { Card } from '../../controls/Card/Card'
import { SearchInPlace } from '../../controls/SearchInPlace/SearchInPlace'
import { Game } from '../../../models/game'

export interface SingleGameProps {
  title: string
  subtitle?: string
  content: JSX.Element | null
  readonly: boolean
  game: Game | null
  handleSelect: (val: Game | null) => void
}

export const SingleGame = (props: SingleGameProps) => {
  return (
    <Card title={props.title}>
      {props.subtitle && <span>{props.subtitle}</span>}
      {props.content}
      <SearchInPlace
        readonly={props.readonly}
        placeholder="Select a game"
        game={props.game}
        handleSelect={props.handleSelect}
      />
    </Card>
  )
}
