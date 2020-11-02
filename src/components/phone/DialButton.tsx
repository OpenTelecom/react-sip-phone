import * as React from 'react'
import styles from './Phone.scss'

interface Props {
  text: string
  click: Function
  letters: string
}

const DialButton = ({ text, click, letters }: Props) => {
  return (
    <div
      id='sip-dial-button'
      className={styles.dialpadButton}
      onClick={() => click()}
    >
      {text}
      <div
        style={{ opacity: letters === '1' ? 0 : 1 }}
        className={styles.dialpadButtonLetters}
      >
        {letters}
      </div>
    </div>
  )
}

export default DialButton
