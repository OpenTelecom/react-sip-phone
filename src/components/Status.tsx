import * as React from 'react'
import styles from './Status.css'

interface Props {
  name: string
}

const Status = ({ name }: Props) => {
  return <div className={styles.container}>
    {name}
  </div>
}
export default Status