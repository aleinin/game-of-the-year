import styled from "styled-components"
import "typeface-roboto"
import { Required } from "../util/global-styles"

export interface CardProps {
  title?: string
  titleFontSize?: TitleFont
  required?: boolean
  subtitle?: string
  content: JSX.Element
  paddingPx?: number
}

export interface TitleFont {
  fontType: "px" | "em"
  fontSize: number
}

const CardContainer = styled("div")<{ paddingPx?: number }>`
  background-color: rgb(24, 24, 24);
  margin-bottom: 10px;
  color: white;
  border-radius: 10px;
  @media only screen and (max-width: 767px) {
    padding: 5px;
  }

  @media only screen and (min-width: 768px) {
    padding: ${(props) => props.paddingPx ?? "15"}px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled("span")<{ titleFont?: TitleFont }>`
  font-size: ${({ titleFont }) =>
    titleFont ? `${titleFont.fontSize}${titleFont.fontType}` : "20px"};
  font-weight: bold;
`

export const Card = (props: CardProps) => {
  const title = (
    <Title titleFont={props.titleFontSize}>
      {props.title} {props.required ? <Required>*</Required> : null}
    </Title>
  )
  const subtitle = props.subtitle ? <span>{props.subtitle}</span> : null
  const content = props.content
  const header =
    props.title || props.required || props.subtitle ? (
      <Header>
        {title}
        {subtitle}
      </Header>
    ) : null
  return (
    <CardContainer paddingPx={props.paddingPx}>
      {header}
      <div>{content}</div>
    </CardContainer>
  )
}
