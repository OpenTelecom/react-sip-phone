import * as React from 'react'
import styles from './Phone.scss'

interface Props {
  open: boolean
}

const Dialpad = ({ open }: Props) => {
  return <div className={open ? styles.dialpadOpen : styles.dialpadClosed}>

  </div>
}
export default Dialpad