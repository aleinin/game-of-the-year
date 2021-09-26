import React from "react"
import { Card } from "../Card"
import { RadioButton } from "primereact/radiobutton"
import { generateRules } from "../../util/generate-rules"
import styled from "styled-components"

export interface GiveawayProps {
  lastTime: string
  readonly: boolean
  enteredGiveaway: boolean | null
  setEnteredGiveaway: (val: boolean) => void
}

const rules = (lastTime: string) => [
  "One entry per person",
  "The gift card will be given digitally through Steam",
  "You must have been a user of the TMW discord prior to the beginning of this contest",
  <li key="random">
    The winner will be revealed by screen recording the entries and rolling a
    random number on <a href="https://random.org">random.org</a>
  </li>,
  `Entries after ${lastTime} are void`,
  "The winner will be announced and prize distributed within a few days",
]

const RadioButtonContainer = styled.div`
  margin-bottom: 10px;
  margin-top: 20px;
`

export const Giveaway = (props: GiveawayProps) => {
  return (
    <Card
      title="Giveaway"
      required={true}
      content={
        <React.Fragment>
          {generateRules(props.readonly, rules(props.lastTime))}
          <RadioButtonContainer>
            <RadioButton
              inputId="yes"
              value={true}
              name="giveaway"
              onChange={(e) => props.setEnteredGiveaway(e.value)}
              checked={props.enteredGiveaway === true}
            />
            <label htmlFor="yes">Yes</label>
          </RadioButtonContainer>
          <RadioButtonContainer>
            <RadioButton
              inputId="no"
              value={false}
              name="giveaway"
              onChange={(e) => props.setEnteredGiveaway(e.value)}
              checked={props.enteredGiveaway === false}
            />
            <label htmlFor="no">No</label>
          </RadioButtonContainer>
        </React.Fragment>
      }
    />
  )
}
