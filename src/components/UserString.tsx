import * as React from 'react'
import styles from './UserString.scss'

interface UserStringProps {
  appSize: string
  name: string
}

// TODO: rename UserString to AppName ?
const UserString = ({ appSize, name }: UserStringProps) => {
  // Default Large
  let usedStyle = styles.userStringLarge
  if (appSize === 'large') {
    usedStyle = styles.userStringLarge
  } else if (appSize === 'medium') {
    usedStyle = styles.userStringMedium
  } else if (appSize === 'small') {
    usedStyle = styles.userStringSmall
  }
  return <div className={usedStyle}>{name}</div>
}

export default UserString
