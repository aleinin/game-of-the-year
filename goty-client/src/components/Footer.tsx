import styled from 'styled-components'

const FooterStyle = styled.div`
  display: flex;
  justify-content: center;
  background-color: rgb(24, 24, 24);
  padding-top: 7px;
  padding-bottom: 7px;
  margin-top: 30px;

  a {
    font-size: 0.8em;
    color: gray;
    text-decoration: none;
  }

  a:hover {
    color: white;
  }
`
const Credit = styled.div`
  flex: 1;
  text-align: center;
`

export const Footer = () => (
  <FooterStyle>
    <Credit>
      <a href="https://github.com/aleinin">aleinin</a>
    </Credit>
    <Credit>
      <a href="https://www.igdb.com">Data provided by IGDB</a>
    </Credit>
    <Credit>
      <a href="https://github.com/erichaagdev">erichaagdev</a>
    </Credit>
  </FooterStyle>
)
