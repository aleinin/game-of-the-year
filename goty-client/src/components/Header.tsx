import { Card } from './controls/Card/Card'
import styles from './Header.module.scss'
import { useProperties } from '../api/useProperties'

export const Header = () => {
  const { properties } = useProperties()
  return (
    <Card className={styles.main}>
      <h1 className={styles.title}>{properties.title}</h1>
    </Card>
  )
}
