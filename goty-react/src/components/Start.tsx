import React, { useEffect } from "react"
import styled from "styled-components"
import { Card } from "./Card"
import { Button } from "primereact/button"
import { SubmissionPage } from "../models/SubmissionPage"

export interface StartProps extends SubmissionPage {
  isGotyConcluded: boolean
  hasSubmission: boolean
  year: number
}

const concluded = (year: number) => {
  const thankYou = (
    <Card
      content={
        <React.Fragment>
          <h2>Game of the Year {year} has concluded</h2>
          <p>Thank you to all who participated</p>
        </React.Fragment>
      }
    />
  )
  const results = (
    <Card
      title="Results"
      titleFontSize={{ fontSize: 2, fontType: "em" }}
      content={<p>TODO RESULTS</p>}
    />
  )
  return (
    <React.Fragment>
      {thankYou}
      {results}
    </React.Fragment>
  )
}

const ButtonSet = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr;

  p-button {
    margin-top: 10px;
  }

  div:nth-child(2) {
    margin-top: 10px;
  }
`

const submissions = (hasSubmission: boolean, handleClick: () => void) => {
  return (
    <Card
      content={
        <ButtonSet>
          <div>
            <Button
              style={{ width: "100%" }}
              label={`${hasSubmission ? "Edit" : "New"} Submission`}
              onClick={handleClick}
            />
          </div>
        </ButtonSet>
      }
    />
  )
}

export const Start = (props: StartProps) => {
  useEffect(() => {
    document.title = "TMW GOTY - Start"
  }, [])
  const handleClick = () => {
    props.setNextStep()
  }
  if (props.isGotyConcluded) {
    return concluded(props.year)
  }
  return submissions(props.hasSubmission, handleClick)
}
