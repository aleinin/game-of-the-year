import { ChevronProps } from './Chevron.types'

export const ChevronDoubleLeft = ({
  width = '25px',
  height = '25px',
}: ChevronProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 17L13 12L18 7M11 17L6 12L11 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
