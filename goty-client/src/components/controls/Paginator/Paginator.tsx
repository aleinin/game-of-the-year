import { ChevronDoubleLeft } from '../../../icons/chevron/ChevronDoubleLeft'
import { ChevronLeft } from '../../../icons/chevron/ChevronLeft'
import { ChevronRight } from '../../../icons/chevron/ChevronRight'
import { ChevronDoubleRight } from '../../../icons/chevron/ChevronDoubleRight'
import { Button } from '../Button/Button'
import { useCallback } from 'react'
import styles from './Paginator.module.scss'

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
    <div className={styles.paginator}>
      <Button disabled={pageIndex === 0} onClick={handleJumpLeft} isIcon>
        <ChevronDoubleLeft />
      </Button>
      <Button disabled={pageIndex === 0} onClick={handleLeft} isIcon>
        <ChevronLeft />
      </Button>
      <div className={styles.index}>
        <span>
          {pageIndex + 1}
          {showTotalPages && ` of ${totalPages}`}
        </span>
      </div>
      <Button
        disabled={pageIndex >= totalPages - 1}
        onClick={handleRight}
        isIcon
      >
        <ChevronRight />
      </Button>
      <Button
        disabled={pageIndex >= totalPages - 1}
        onClick={handleJumpRight}
        isIcon
      >
        <ChevronDoubleRight />
      </Button>
    </div>
  )
}
