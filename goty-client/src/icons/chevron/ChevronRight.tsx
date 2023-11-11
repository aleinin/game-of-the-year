import { ChevronProps } from './Chevron.types'

export const ChevronRight = ({
  width = '25px',
  height = '25px',
}: ChevronProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M9 6L15 12L9 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
