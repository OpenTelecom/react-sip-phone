import * as React from 'react'
import styles from './Phone.scss'
import { GetStyleSize } from '../../util/getstyle'

interface Props {
  text: string
  click: Function
  letters: string
  appSize: string
}

const DialButton = ({ text, click, letters, appSize }: Props) => {
  const dialpadButtonStyle = GetStyleSize(appSize, 'dialpadButton', styles)
  return (
    <div
      id='sip-dial-button'
      className={dialpadButtonStyle}
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
