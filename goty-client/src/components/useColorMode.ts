import { useCallback, useEffect, useState } from 'react'

const DATA_THEME_NAME = 'data-theme'
const colorModePreferenceKey = 'colorModePreference'
enum ColorMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export const useColorMode = (): [boolean, () => void] => {
  const [colorMode, setColorMode] = useState(
    localStorage.getItem(colorModePreferenceKey) ?? ColorMode.DARK,
  )
  const toggleColorMode = useCallback(() => {
    setColorMode(
      colorMode === ColorMode.DARK ? ColorMode.LIGHT : ColorMode.DARK,
    )
  }, [colorMode, setColorMode])
  useEffect(() => {
    const dataTheme = document.documentElement.getAttribute(DATA_THEME_NAME)
    if (colorMode !== dataTheme) {
      document.documentElement.setAttribute(DATA_THEME_NAME, colorMode)
      localStorage.setItem(colorModePreferenceKey, colorMode)
    }
  }, [colorMode])
  return [colorMode === ColorMode.DARK, toggleColorMode]
}
