import React from "react"
import styled from "styled-components"
import { Card } from "./Card"

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
export const Header = (props: { year: number }) => {
  const content = (
    <React.Fragment>
      <Title>The Midnight Watchmen's</Title>
      <Title>Top Games of the Year {props.year}</Title>
      <Footer>
        <a href="https://github.com/aleinin">Frontend by aleinin</a>
        <a href="https://www.igdb.com">Data provided by IGDB</a>
        <a href="https://github.com/Gorlah">Backend by Gorlah</a>
      </Footer>
    </React.Fragment>
  )
  return <Card content={content} paddingPx={20}></Card>
}
