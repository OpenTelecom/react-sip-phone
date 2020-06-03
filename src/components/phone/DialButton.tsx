import * as React from 'react'
import styles from './Phone.scss'

interface Props {
  text: string,
  click: Function,
  style?: any
}

const DialButton = ({ text, click, style = {} }: Props) => {
return <div className={styles.dialpadButton} onClick={() => click()} style={style}>{text}</div>
}

export default DialButton