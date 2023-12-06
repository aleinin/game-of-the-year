import React, { CSSProperties } from 'react'
import styles from './Card.module.scss'
import classNames from 'classnames'
import { Link } from '../../../icons/link/Link'
import { Button, ButtonType } from '../Button/Button'

export interface CardProps {
  id?: string
  title?: string
  titleFontSize?: string
  required?: boolean
  index?: string
  border?: boolean
  className?: string
  style?: CSSProperties
  onLinkClick?: () => void
  hasAnchorButton?: boolean
}

export const Card = ({
  border,
  children,
  className,
  id,
  index,
  onLinkClick,
  required,
  style,
  title,
  titleFontSize,
  hasAnchorButton = false,
}: React.PropsWithChildren<CardProps>) => (
  <div
    id={id}
    style={style}
    className={classNames(styles.card, { [styles.border]: border }, className)}
  >
    <Header
      id={id}
      title={title}
      required={required}
      onLinkClick={onLinkClick}
      index={index}
      titleFontSize={titleFontSize}
      hasAnchorButton={hasAnchorButton}
    />
    {children}
  </div>
)

interface HeaderProps {
  id?: string
  title?: string
  required?: boolean
  onLinkClick?: () => void
  index?: string
  titleFontSize?: string
  hasAnchorButton: boolean
}
const Header = ({
  id,
  title,
  required,
  onLinkClick,
  index,
  titleFontSize,
  hasAnchorButton,
}: HeaderProps) => {
  return title || required || index ? (
    <div className={styles.header}>
      <div className={styles.titleLink}>
        <span
          className={styles.title}
          style={{ fontSize: `${titleFontSize ?? '1.5em'}` }}
        >
          {title} {required ? <span className={styles.required}>*</span> : null}
        </span>
        {id && hasAnchorButton && (
          <Button
            onClick={() => onLinkClick && onLinkClick()}
            buttonType={ButtonType.ICON}
            ariaLabel={`Anchor to ${title}`}
            className={styles.anchorButton}
          >
            <Link />
          </Button>
        )}
      </div>
      {index && <div className={styles.pageIndex}>{index}</div>}
    </div>
  ) : null
}
