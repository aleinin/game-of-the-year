import { ChevronDoubleLeft } from '../../../icons/chevron/ChevronDoubleLeft'
import { ChevronLeft } from '../../../icons/chevron/ChevronLeft'
import { ChevronRight } from '../../../icons/chevron/ChevronRight'
import { ChevronDoubleRight } from '../../../icons/chevron/ChevronDoubleRight'
import { Button, ButtonType } from '../Button/Button'
import { useCallback } from 'react'
import styles from './Paginator.module.scss'
import classNames from 'classnames'

export interface PaginatorProps {
  totalPages: number
  pageIndex: number
  setIndex: (newIndex: number) => void
  showTotalPages?: boolean
  className?: string
}
export const Paginator = ({
  pageIndex,
  totalPages,
  setIndex,
  showTotalPages = false,
  className,
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
    <div className={classNames(styles.paginator, className)}>
      <Button
        disabled={pageIndex === 0}
        onClick={handleJumpLeft}
        buttonType={ButtonType.ICON}
      >
        <ChevronDoubleLeft />
      </Button>
      <Button
        disabled={pageIndex === 0}
        onClick={handleLeft}
        buttonType={ButtonType.ICON}
      >
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
        buttonType={ButtonType.ICON}
      >
        <ChevronRight />
      </Button>
      <Button
        disabled={pageIndex >= totalPages - 1}
        onClick={handleJumpRight}
        buttonType={ButtonType.ICON}
      >
        <ChevronDoubleRight />
      </Button>
    </div>
  )
}
