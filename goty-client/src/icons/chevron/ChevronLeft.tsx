import { ChevronProps } from './Chevron.types'

export const ChevronLeft = ({
  width = '25px',
  height = '25px',
}: ChevronProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M15 6L9 12L15 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
