import styled from 'styled-components'
export const Container = styled.div<{ $width?: string }>`
  position: relative;
  width: ${({ $width }) => ($width != null ? $width : '100%')};
`
export const Control = styled.div`
  position: relative;
  border: 1px solid gray;
  border-radius: 4px;
  box-sizing: border-box;
  cursor: default;
  outline: none;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 4px 4px 0px;
  font-size: 14px;
  min-width: 65px;
  height: 100%;

  &:focus {
    outline: #02b3e6 2px solid;
  }
`

export const MenuContainer = styled.div`
  background-color: black;
  border: 1px solid #ccc;
  box-shadow: rgba(0, 0, 0, 0.16) 0 4px 4px 0;
  box-sizing: border-box;
  margin-top: 2px;
  max-height: 200px;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1000;
  font-size: 14px;
`

export const NoResults = styled.div`
  box-sizing: border-box;
  color: #ccc;
  cursor: default;
  display: block;
  padding: 8px 10px;
`

export const OptionContainer = styled.div`
  box-sizing: border-box;
  background-color: black;
  cursor: pointer;
  display: block;
  padding: 10px 10px;
  transition: ease-in-out 400ms;

  &:last-child {
    border-bottom-right-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  &:hover {
    background-color: rgb(192, 192, 192);
    color: #333;
  }

  .is-selected {
    background-color: rgb(141, 141, 141);
    color: #333;
  }

  .is-selected:hover {
    background-color: rgb(192, 192, 192);
    color: #333;
  }
`

export const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`
