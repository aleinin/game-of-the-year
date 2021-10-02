import React from 'react'
import { Card } from '../Card'
import { RadioButton } from 'primereact/radiobutton'
import { generateRules } from '../../util/generate-rules'
import styled from 'styled-components'
import { useSelector, useStore } from 'react-redux'
import { selectConstants } from '../../state/constants/selectors'
import { createUpdateEnteredGiveawayAction } from '../../state/submission/actions'

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

const RadioButtonContainer = styled.div`
  margin-bottom: 10px;
  margin-top: 20px;
`

const RadioLabel = styled.label`
  margin-left: 5px;
`

export const Giveaway = (props: GiveawayProps) => {
  const { lastTime } = useSelector(selectConstants)
  const store = useStore()
  const handleClick = (enteredGiveaway: boolean) => {
    if (!props.readonly) {
      store.dispatch(createUpdateEnteredGiveawayAction(enteredGiveaway))
    }
  }
  return (
    <Card
      title="Giveaway"
      required={true}
      content={
        <React.Fragment>
          {generateRules(props.readonly, rules(lastTime))}
          <RadioButtonContainer>
            <RadioButton
              inputId="yes"
              value={true}
              name="giveaway"
              onChange={(e) => handleClick(e.value)}
              checked={props.enteredGiveaway === true}
            />
            <RadioLabel htmlFor="yes">Yes</RadioLabel>
          </RadioButtonContainer>
          <RadioButtonContainer>
            <RadioButton
              inputId="no"
              value={false}
              name="giveaway"
              onChange={(e) => handleClick(e.value)}
              checked={props.enteredGiveaway === false}
            />
            <RadioLabel htmlFor="no">No</RadioLabel>
          </RadioButtonContainer>
        </React.Fragment>
      }
    />
  )
}
