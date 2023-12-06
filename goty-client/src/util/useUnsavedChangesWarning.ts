import { useEffect } from 'react'

export const useUnsavedChangesWarning = (isDirty: boolean) => {
  useEffect(() => {
    const beforeUnload = (e: any) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = true
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [isDirty])
}
