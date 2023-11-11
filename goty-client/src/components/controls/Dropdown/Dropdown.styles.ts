import styled from 'styled-components'
export const Container = styled.div<{ $width?: string }>`
  position: relative;
  width: ${({ $width }) => ($width != null ? $width : '100%')};
`

export const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`
