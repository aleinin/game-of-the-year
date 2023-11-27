import React from 'react'
import { useSelector } from 'react-redux'
import { selectProperties } from '../state/properties/selectors'
import { Card } from './controls/Card/Card'
import styles from './Header.module.scss'

export const Header = () => {
  const { title } = useSelector(selectProperties)
  return (
    <Card className={styles.main}>
      <h1 className={styles.title}>{title}</h1>
    </Card>
  )
}
