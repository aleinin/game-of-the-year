import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { selectProperties } from '../state/properties/selectors'
import { Card } from './Card'

const Title = styled.h1`
  font-size: 2em;
  font-weight: bold;
`

const Footer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;

  a {
    font-size: 0.8em;
    color: gray;
    text-decoration: none;
  }

  a:hover {
    color: white;
  }
`
export const Header = () => {
  const { year } = useSelector(selectProperties)
  return (
    <Card paddingPx={20}>
      <Title>The Midnight Watchmen's</Title>
      <Title>Top Games of the Year {year}</Title>
      <Footer>
        <a href="https://github.com/aleinin">Frontend by aleinin</a>
        <a href="https://www.igdb.com">Data provided by IGDB</a>
        <a href="https://github.com/Gorlah">Backend by Gorlah</a>
      </Footer>
    </Card>
  )
}
