import styles from './ColorModeSwitch.module.scss'
import { Sun } from '../../../icons/Sun'
import { Moon } from '../../../icons/Moon'
import { useState } from 'react'
import classNames from 'classnames'
import { useColorMode } from '../../useColorMode'

export const ColorModeSwitch = () => {
  const [isDarkMode, toggleColorMode] = useColorMode()
  const [internalIsDarkMode, setInternalIsDarkMode] = useState(isDarkMode)
  const handleOnChange = () => {
    setInternalIsDarkMode(!isDarkMode)
    // wait for animation
    setTimeout(() => {
      toggleColorMode()
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
