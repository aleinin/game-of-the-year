import { MutableRefObject, Ref, useCallback, useEffect } from 'react'

export const useClickOff = (
  ref: MutableRefObject<any>,
  callback: () => void,
) => {
  const handleDocumentClick = useCallback(
    (event: any) => {
      if (!event.composedPath().includes(ref.current)) {
        callback()
      }
    },
    [ref, callback],
  )
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [handleDocumentClick])
}
