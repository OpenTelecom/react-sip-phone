import * as React from 'react'
import styles from './Status.scss'

interface Props {
  name: string
}

const Status = ({ name }: Props) => {
  return <div className={styles.container}>
    {name}
  </div>
}
export default Status