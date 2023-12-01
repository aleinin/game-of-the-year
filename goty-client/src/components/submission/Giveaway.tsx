import React from 'react'
import { Card } from '../controls/Card/Card'
import { useSelector, useStore } from 'react-redux'
import { selectProperties } from '../../state/properties/selectors'
import { createUpdateEnteredGiveawayAction } from '../../state/submission/actions'
import { RadioOption, RadioSet } from '../controls/RadioSet/RadioSet'
import { Rules } from './Rules'

export interface GiveawayProps {
  readonly: boolean
  enteredGiveaway: boolean | null
}

const rules = (lastTime: string) => [
  'One entry per person',
  'The gift card will be given digitally through Steam',
  'You must have been a user of the TMW discord prior to the beginning of this contest',
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
    <Card title={'Giveaway'} required={true}>
      <span>{`Do you want to enter the $${giveawayAmountUSD} Steam GC Giveaway?`}</span>
      <Rules readonly={props.readonly} rules={rules(deadline)} />
      <RadioSet
        disabled={props.readonly}
        name="giveaway"
        options={options}
        onChange={handleClick}
        selectedValue={props.enteredGiveaway}
      />
    </Card>
  )
}
