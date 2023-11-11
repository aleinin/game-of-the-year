import { ChevronProps } from './Chevron.types'

export const ChevronUp = ({
  width = '25px',
  height = '25px',
}: ChevronProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 15L12 9L18 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
