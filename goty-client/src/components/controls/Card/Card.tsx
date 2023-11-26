import React, { CSSProperties } from 'react'
import styles from './Card.module.scss'
import classNames from 'classnames'

export interface CardProps {
  title?: string
  titleFontSize?: string
  required?: boolean
  index?: string
  border?: boolean
  className?: string
  style?: CSSProperties
}

export const Card = (props: React.PropsWithChildren<CardProps>) => {
  const title = (
    <span
      className={styles.title}
      style={{ fontSize: `${props.titleFontSize ?? '1.5em'}` }}
    >
      {props.title}{' '}
      {props.required ? <span className={styles.required}>*</span> : null}
    </span>
  )
  const index = props.index ? <span>{props.index}</span> : null
  const header =
    props.title || props.required || props.index ? (
      <div className={styles.header}>
        {title}
        {index}
      </div>
    ) : null
  return (
    <div
      style={props.style}
      className={classNames(
        styles.card,
        { [styles.border]: props.border },
        props.className,
      )}
    >
      {header}
      {props.children}
    </div>
  )
}
