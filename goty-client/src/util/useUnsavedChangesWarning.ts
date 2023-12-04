import { useEffect } from 'react'

export const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  useEffect(() => {
    const beforeUnload = (e: any) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = true
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [hasUnsavedChanges])
}
