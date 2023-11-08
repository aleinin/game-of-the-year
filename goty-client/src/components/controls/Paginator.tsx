import styled from 'styled-components'
import { ChevronDoubleLeft } from '../../icons/chevron/ChevronDoubleLeft'
import { ChevronLeft } from '../../icons/chevron/ChevronLeft'
import { ChevronRight } from '../../icons/chevron/ChevronRight'
import { ChevronDoubleRight } from '../../icons/chevron/ChevronDoubleRight'
import { IconButton } from './table/IconButton'
import { useCallback } from 'react'

const PaginatorContainer = styled.div`
  display: grid;
  height: 100%;
`
const PaginatorStyle = styled.div`
  background: none;
  display: flex;
  justify-content: space-between;
  grid-column-start: 2;
  padding-left: 10px;
  padding-right: 10px;

  svg,
  span {
    align-self: center;
  }
`
const PageIndex = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
export interface PaginatorProps {
  totalPages: number
  pageIndex: number
  setIndex: (newIndex: number) => void
  showTotalPages?: boolean
}
export const Paginator = ({
  pageIndex,
  totalPages,
  setIndex,
  showTotalPages = false,
}: PaginatorProps) => {
  const handleJumpLeft = useCallback(() => setIndex && setIndex(0), [setIndex])
  const handleJumpRight = useCallback(
    () => setIndex && setIndex(Math.max(0, totalPages - 1)),
    [setIndex, totalPages],
  )
  const handleLeft = useCallback(
    () => setIndex && setIndex(Math.max(0, pageIndex - 1)),
    [setIndex, pageIndex],
  )
  const handleRight = useCallback(
    () => setIndex && setIndex(Math.min(totalPages - 1, pageIndex + 1)),
    [setIndex, pageIndex, totalPages],
  )
  return (
    <PaginatorContainer>
      <PaginatorStyle>
        <IconButton disabled={pageIndex === 0} onClick={handleJumpLeft}>
          <ChevronDoubleLeft />
        </IconButton>
        <IconButton disabled={pageIndex === 0} onClick={handleLeft}>
          <ChevronLeft />
        </IconButton>
        <PageIndex>
          <span>
            {pageIndex + 1}
            {showTotalPages && ` of ${totalPages}`}
          </span>
        </PageIndex>
        <IconButton
          disabled={pageIndex >= totalPages - 1}
          onClick={handleRight}
        >
          <ChevronRight />
        </IconButton>
        <IconButton
          disabled={pageIndex >= totalPages - 1}
          onClick={handleJumpRight}
        >
          <ChevronDoubleRight />
        </IconButton>
      </PaginatorStyle>
    </PaginatorContainer>
  )
}
