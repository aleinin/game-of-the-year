import React, { CSSProperties } from 'react'
import styles from './Card.module.scss'
import classNames from 'classnames'

export interface CardProps {
  title?: string
  titleFontSize?: string
  required?: boolean
  subtitle?: string
  border?: boolean
  className?: string
  style?: CSSProperties
}

export const Card = (props: React.PropsWithChildren<CardProps>) => {
  const title = (
    <span
      className={styles.title}
      style={{ fontSize: `${props.titleFontSize ?? '20px'}` }}
    >
      {props.title}{' '}
      {props.required ? <span className={styles.required}>*</span> : null}
    </span>
  )
  const subtitle = props.subtitle ? <span>{props.subtitle}</span> : null
  const header =
    props.title || props.required || props.subtitle ? (
      <div className={styles.header}>
        {title}
        {subtitle}
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
      <div>{props.children}</div>
    </div>
  )
}
