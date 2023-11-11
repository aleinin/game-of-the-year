import styled from 'styled-components'
import { Required } from '../util/global-styles'
import { CSSProperties } from 'react'
export interface CardProps {
  title?: string
  titleFontSize?: TitleFont
  required?: boolean
  subtitle?: string
  paddingPx?: number
  border?: boolean
  style?: CSSProperties
}

export interface TitleFont {
  fontType: 'px' | 'em'
  fontSize: number
}

const CardContainer = styled('div')<{ $paddingPx?: number; $border: boolean }>`
  background-color: rgb(24, 24, 24);
  margin-bottom: 10px;
  color: white;
  border-radius: 10px;
  @media only screen and (max-width: 767px) {
    padding: 5px;
  }

  @media only screen and (min-width: 768px) {
    padding: ${(props) => props.$paddingPx ?? '15'}px;
  }
  ${({ $border }) => ($border ? 'border: 1px solid #575757;' : '')}
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled('span')<{ titleFont?: TitleFont }>`
  font-size: ${({ titleFont }) =>
    titleFont ? `${titleFont.fontSize}${titleFont.fontType}` : '20px'};
  font-weight: bold;
`

export const Card = (props: React.PropsWithChildren<CardProps>) => {
  const title = (
    <Title titleFont={props.titleFontSize}>
      {props.title} {props.required ? <Required>*</Required> : null}
    </Title>
  )
  const subtitle = props.subtitle ? <span>{props.subtitle}</span> : null
  const header =
    props.title || props.required || props.subtitle ? (
      <Header>
        {title}
        {subtitle}
      </Header>
    ) : null
  return (
    <CardContainer
      $paddingPx={props.paddingPx}
      $border={props.border ?? true}
      style={props.style}
    >
      {header}
      <div>{props.children}</div>
    </CardContainer>
  )
}
