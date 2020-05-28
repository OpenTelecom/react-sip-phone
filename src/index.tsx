import * as React from 'react'
import { Provider } from 'react-redux'
import styles from './styles.module.scss'
import SipWrapper from './SipWrapper'
import Status from './components/Status'
import { SipConfig, SipCredentials } from './models'

import defaultStore from './store/configureStore'

interface Props {
  width: number
  name: string
  sipCredentials: SipCredentials
  sipConfig: SipConfig
  store: any
}

export let phoneStore = defaultStore

export const ReactSipPhone = ({
  name,
  width,
  store,
  sipConfig,
  sipCredentials
}: Props) => {
  //If no store is passed into component, default store is used
  const phoneStore = store ? store : defaultStore

  return (
    <Provider store={phoneStore}>
      <SipWrapper sipConfig={sipConfig} sipCredentials={sipCredentials}>
        <div className={styles.container} style={{ width: `${width}px` }}>
          <Status name={name} />
        </div>
      </SipWrapper>
    </Provider>
  )
}
