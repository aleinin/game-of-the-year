import { CSSProperties } from 'react'
import styles from './Spinner.module.scss'
import classNames from 'classnames'

export interface SpinnerProps {
  width?: string
  height?: string
  style?: CSSProperties
  className?: string
}
export const Spinner = ({
  width = '25px',
  height = '25px',
  style,
  className,
}: SpinnerProps) => (
  <svg
    style={style}
    width={width}
    height={height}
    viewBox="0 0 25 25"
    fill="none"
    className={classNames(styles.spinner, className)}
  >
    <path
      d="M4.5 12.5C4.5 16.9183 8.08172 20.5 12.5 20.5C16.9183 20.5 20.5 16.9183 20.5 12.5C20.5 8.08172 16.9183 4.5 12.5 4.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
)
