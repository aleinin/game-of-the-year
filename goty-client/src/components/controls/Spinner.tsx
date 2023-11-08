import styled from 'styled-components'

const SpinnerStyle = styled.span<{ $sizePx: number }>`
  &:after {
    content: '';
    box-sizing: border-box;
    width: ${({ $sizePx }) => `${$sizePx}px`};
    height: ${({ $sizePx }) => `${$sizePx}px`};
    // position: absolute;
    // top: calc(25% - ${({ $sizePx }) => `${Math.floor($sizePx / 2)}px`});
    // left: calc(50% - ${({ $sizePx }) => `${Math.floor($sizePx / 2)}px`});
    border-radius: 50%;
    border-top: 4px solid rgba(255, 255, 255, 1);
    border-left: 4px solid rgba(255, 255, 255, 1);
    border-right: 4px solid rgba(255, 255, 255, 0);
    animation: spinner 0.6s linear infinite;
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
`
export interface SpinnerProps {
  sizePx?: number
}

export const Spinner = ({ sizePx = 40 }: SpinnerProps) => (
  <SpinnerStyle $sizePx={sizePx} />
)
