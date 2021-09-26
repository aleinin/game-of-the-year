import styled from "styled-components"
import "typeface-roboto"

export interface CardProps {
  title: string
  required?: boolean
  subtitle?: string
  content: JSX.Element
  paddingPx?: number
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

const Required = styled.span`
  color: #b00020;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled.span`
  font-size: 20px;
  font-weight: bold;
`

export const Card = (props: CardProps) => {
  const title = (
    <Title>
      {props.title} {props.required ? <Required /> : null}
    </Title>
  )
  const subtitle = props.subtitle ? <span>{props.subtitle}</span> : null
  const content = props.content
  return (
    <CardContainer paddingPx={props.paddingPx}>
      <Header>
        {title}
        {subtitle}
      </Header>
      <div>{content}</div>
    </CardContainer>
  )
}
