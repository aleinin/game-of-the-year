import styles from './ColorModeSwitch.module.scss'
import { Sun } from '../../../icons/Sun'
import { Moon } from '../../../icons/Moon'
import { useState } from 'react'
import classNames from 'classnames'

interface ColorModeSwitchProps {
  onChange?: () => void
  isDarkMode?: boolean
}
export const ColorModeSwitch = ({
  onChange,
  isDarkMode = true,
}: ColorModeSwitchProps) => {
  const [internalIsDarkMode, setInternalIsDarkMode] = useState(isDarkMode)
  const handleOnChange = () => {
    setInternalIsDarkMode(!isDarkMode)
    // wait for animation
    setTimeout(() => {
      onChange && onChange()
    }, 400)
  }
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classNames(
        styles.switch,
        isDarkMode ? styles.moon : styles.sun,
      )}
    >
      <input
        onChange={handleOnChange}
        type="checkbox"
        checked={internalIsDarkMode}
      />
      <div className={styles.slider}>
        {isDarkMode ? <Moon size="30px" /> : <Sun size="30px" />}
      </div>
    </label>
  )
}
