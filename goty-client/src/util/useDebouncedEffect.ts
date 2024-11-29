import { useEffect } from 'react'

export const useDebouncedEffect = (
  effect: () => any,
  deps: any[],
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay)
    return () => clearTimeout(handler)
  }, [...(deps || []), effect, delay]) // eslint-disable-line react-hooks/exhaustive-deps
}
