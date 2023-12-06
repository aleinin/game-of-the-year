import { Card } from './controls/Card/Card'
import styles from './Header.module.scss'
import { useProperties } from '../api/useProperties'
import { ColorModeSwitch } from './controls/ColorModeSwitch/ColorModeSwitch'

export const Header = () => {
  const { properties } = useProperties()
  return (
    <Card className={styles.main}>
      <div className={styles.colorToggle}>
        <ColorModeSwitch />
      </div>
      <h1>{properties.title}</h1>
    </Card>
  )
}
