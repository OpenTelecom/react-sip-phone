import * as React from 'react'
import styles from './Phone.scss'
import DialButton from './DialButton'

interface Props {
  open: boolean
}

function handleClick(value: string) {
  return value // Placeholder
}

function getButton(value: string) {
  return <DialButton text={value} click={() => handleClick(value)} />
}

const topRow: any = []
for (let x = 1; x < 4; x++) {
  topRow.push(getButton(x.toString()))
}

const middleRow: any = []
for (let x = 4; x < 7; x++) {
  middleRow.push(getButton(x.toString()))
}

const bottomRow: any = []
for (let x = 7; x < 10; x++) {
  bottomRow.push(getButton(x.toString()))
}

const Dialpad = ({ open }: Props) => {
  return (
    <div className={open ? styles.dialpadOpen : styles.dialpadClosed}>
      <div className='dialpadRow1'>{topRow}</div>
      <div className='dialpadRow2'>{middleRow}</div>
      <div className='dialpadRow3'>{bottomRow}</div>
      <div className='dialpadRow4'>{}</div>
    </div>
  )
}
export default Dialpad
