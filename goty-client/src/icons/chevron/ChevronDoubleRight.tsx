import { ChevronProps } from './Chevron.types'

export const ChevronDoubleRight = ({
  width = '25px',
  height = '25px',
}: ChevronProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 17L11 12L6 7M13 17L18 12L13 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
