import React from 'react'
import styled from 'styled-components'
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
    <React.Fragment>
      <i
        className={`pi pi-angle-double-left big-pi ${
          pageIndex > 0 ? '' : 'disabled'
        }`}
        onClick={() => handleMove(MoveType.JumpLeft)}
      />
      <i
        className={`pi pi-angle-left big-pi ${pageIndex > 0 ? '' : 'disabled'}`}
        onClick={() => handleMove(MoveType.Left)}
      />
    </React.Fragment>
  )
  const rightControls = (
    <React.Fragment>
      <i
        className={`pi pi-angle-right big-pi ${
          pageIndex < totalPages - 1 ? '' : 'disabled'
        }`}
        onClick={() => handleMove(MoveType.Right)}
      />
      <i
        className={`pi pi-angle-double-right big-pi ${
          pageIndex < totalPages - 1 ? '' : 'disabled'
        }`}
        onClick={() => handleMove(MoveType.JumpRight)}
      />
    </React.Fragment>
  )
  return (
    <Card
      border={false}
      content={
        <Controls>
          <div>
            {totalPages > 1 ? leftControls : null}
            <Pages data-testid="current-page">
              {pageIndex + 1} of {totalPages}
            </Pages>
            {totalPages > 1 ? rightControls : null}
          </div>
        </Controls>
      }
    />
  )
}
