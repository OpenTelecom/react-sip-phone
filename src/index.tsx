import * as React from 'react'
import styles from './styles.module.css'
import Status from  './components/Status'

interface Props {
  width: number,
  name: string,
  sipCredentials: Object,
  sipConfig: Object
}

export const ExampleComponent = ({ name, width }: Props) => {
  return <div className={styles.container} style={{width: `${width}px`}}>
    <Status name={name} />
  </div>
}
