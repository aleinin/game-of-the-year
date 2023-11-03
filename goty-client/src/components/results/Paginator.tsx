import React from 'react'
import styled from 'styled-components'
import { disableColor } from '../../util/global-styles'
import { Card } from '../Card'

export interface PaginatorProps {
  totalPages: number
  pageIndex: number
  setIndex: (newIndex: number) => void
}

const Controls = styled.div`
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
  }
`

const disabledStyle = `
  color: ${disableColor}
`

const enabledStyle = `
&:hover:not(.disabled) {
  text-shadow: 0 0 5px black;
  color: rgba(103, 58, 183, 0.92);
}
cursor: pointer
`

export const Arrow = styled.i<{ disabled: boolean }>`
  font-size: 1.2em;
  ${({ disabled }) => (disabled ? disabledStyle : enabledStyle)}
`

const Pages = styled.span`
  margin-left: 5px;
  margin-right: 5px;
  width: 80px;
  display: inline-block;
  text-align: center;

  i:hover:not(.disabled) {
    cursor: pointer;
    color: #673ab7;
    text-shadow: 0 0 5px #673ab7;
  }
`

enum MoveType {
  JumpLeft,
  Left,
  Right,
  JumpRight,
}

export const Paginator = ({
  totalPages,
  pageIndex,
  setIndex,
}: PaginatorProps) => {
  const handleMove = (moveType: MoveType) => {
    let newIndex
    switch (moveType) {
      case MoveType.JumpLeft:
        setIndex(0)
        break
      case MoveType.Left:
        newIndex = pageIndex - 1
        setIndex(newIndex >= 0 ? newIndex : 0)
        break
      case MoveType.Right:
        newIndex = pageIndex + 1
        setIndex(newIndex <= totalPages - 1 ? newIndex : totalPages - 1)
        break
      case MoveType.JumpRight:
        setIndex(totalPages - 1)
        break
    }
  }
  const leftControls = (
    <>
      <Arrow
        disabled={pageIndex <= 0}
        className="pi pi-angle-double-left"
        data-testid="jump-left"
        onClick={() => handleMove(MoveType.JumpLeft)}
      />
      <Arrow
        disabled={pageIndex <= 0}
        className="pi pi-angle-left"
        data-testid="left"
        onClick={() => handleMove(MoveType.Left)}
      />
    </>
  )
  const rightControls = (
    <>
      <Arrow
        disabled={pageIndex >= totalPages - 1}
        className="pi pi-angle-right"
        data-testid="right"
        onClick={() => handleMove(MoveType.Right)}
      />
      <Arrow
        disabled={pageIndex >= totalPages - 1}
        className="pi pi-angle-double-right"
        data-testid="jump-right"
        onClick={() => handleMove(MoveType.JumpRight)}
      />
    </>
  )
  return (
    <Card>
      <Controls>
        <div>
          {totalPages > 1 ? leftControls : null}
          <Pages data-testid="current-page">
            {pageIndex + 1} of {totalPages}
          </Pages>
          {totalPages > 1 ? rightControls : null}
        </div>
      </Controls>
    </Card>
  )
}
