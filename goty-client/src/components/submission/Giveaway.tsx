import { Card } from '../controls/Card/Card'
import { RadioOption, RadioSet } from '../controls/RadioSet/RadioSet'
import { Rules } from './Rules'
import { useProperties } from '../../api/useProperties'

export interface GiveawayProps {
  readonly: boolean
  enteredGiveaway: boolean | null
  handleSetGiveaway?: (enteredGiveaway: boolean) => void
}

const rules = (lastTime: string) => [
  'One entry per person',
  'The gift card will be given digitally through Steam',
  'You must have been a user of the TMW discord prior to the beginning of this contest',
  `Entries after ${lastTime} are void`,
  'The winner will be announced and prize distributed within a few days',
]

export const Giveaway = ({
  enteredGiveaway,
  handleSetGiveaway,
  readonly,
}: GiveawayProps) => {
  const { properties } = useProperties()
  const handleClick = (enteredGiveaway: boolean) => {
    handleSetGiveaway && handleSetGiveaway(enteredGiveaway)
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
    <Card title={'Giveaway'} required={!readonly}>
      <span>{`Do you want to enter the $${properties.giveawayAmountUSD} Steam GC Giveaway?`}</span>
      <Rules readonly={readonly} rules={rules(properties.deadline)} />
      <RadioSet
        disabled={readonly}
        name="giveaway"
        options={options}
        onChange={handleClick}
        selectedValue={enteredGiveaway}
      />
    </Card>
  )
}
