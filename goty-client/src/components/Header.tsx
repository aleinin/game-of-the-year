import { Card } from './controls/Card/Card'
import styles from './Header.module.scss'
import { useProperties } from '../api/useProperties'
import { ColorModeSwitch } from './controls/ColorModeSwitch/ColorModeSwitch'
import { useColorMode } from './useColorMode'

export const Header = () => {
  const [isDarkMode, toggleColorMode] = useColorMode()
  const { properties } = useProperties()
  return (
    <Card className={styles.main}>
      <div className={styles.colorToggle}>
        <ColorModeSwitch
          isDarkMode={isDarkMode}
          onChange={() => toggleColorMode()}
        />
      </div>
      <h1>{properties.title}</h1>
    </Card>
  )
}
