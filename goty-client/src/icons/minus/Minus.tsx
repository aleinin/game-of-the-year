export interface MinusProps {
  width?: string
  height?: string
}
export const Minus = ({ width = '25px', height = '25px' }: MinusProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path
      d="M6 12L18 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
