import React from 'react'
import { useSelector } from 'react-redux'
import { selectProperties } from '../state/properties/selectors'
import { Card } from './controls/Card/Card'
import styles from './Header.module.scss'

export const Header = () => {
  const { year } = useSelector(selectProperties)
  return (
    <Card className={styles.main}>
      <h1 className={styles.title}>The Midnight Watchmen's</h1>
      <h1 className={styles.title}>Top Games of the Year {year}</h1>
    </Card>
  )
}
