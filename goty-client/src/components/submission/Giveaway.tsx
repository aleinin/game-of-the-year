import React from 'react'
import { Card } from '../Card'

import { generateRules } from '../../util/generate-rules'
import { useSelector, useStore } from 'react-redux'
import { selectProperties } from '../../state/properties/selectors'
import { createUpdateEnteredGiveawayAction } from '../../state/submission/actions'
import { GotyRadioSet, RadioOption } from '../styled-controls/GotyRadioButton'

export interface GiveawayProps {
  readonly: boolean
  enteredGiveaway: boolean | null
}

const rules = (lastTime: string) => [
  'One entry per person',
  'The gift card will be given digitally through Steam',
  'You must have been a user of the TMW discord prior to the beginning of this contest',
  <li key="random">
    The winner will be revealed by screen recording the entries and rolling a
    random number on <a href="https://random.org">random.org</a>
  </li>,
  `Entries after ${lastTime} are void`,
  'The winner will be announced and prize distributed within a few days',
]

export const Giveaway = (props: GiveawayProps) => {
  const { deadline, giveawayAmountUSD } = useSelector(selectProperties)
  const store = useStore()
  const handleClick = (enteredGiveaway: boolean) => {
    if (!props.readonly) {
      store.dispatch(createUpdateEnteredGiveawayAction(enteredGiveaway))
    }
  }
  const options: RadioOption[] = [
    {
      id: 'yes',
      value: true,
      label: 'Yes',
    },
    {
      id: 'no',
      value: false,
      label: 'No',
    },
  ]
  return (
    <Card title={`$${giveawayAmountUSD} Giveaway`} required={true}>
      {generateRules(props.readonly, rules(deadline))}
      <GotyRadioSet
        disabled={props.readonly}
        name="giveaway"
        onChange={(e) => handleClick(e.value)}
        options={options}
        selectedValue={props.enteredGiveaway}
      />
    </Card>
  )
}
