import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectProperties } from '../state/properties/selectors'
import { Card } from './Card'

const Title = styled.h1`
  font-size: 2em;
  font-weight: bold;
`

export const Header = () => {
  const { year } = useSelector(selectProperties)
  return (
    <Card paddingPx={20}>
      <Title>The Midnight Watchmen's</Title>
      <Title>Top Games of the Year {year}</Title>
    </Card>
  )
}
