import * as React from 'react'
import { Provider } from 'react-redux'
import styles from './styles.module.scss'
import SipWrapper from './SipWrapper'
import Status from './components/Status'
import PhoneSessions from './components/PhoneSessions'
import Dialstring from './components/Dialstring'
import { SipConfig, SipCredentials } from './models'

import defaultStore from './store/configureStore'

interface Props {
  width: number
  name: string
  sipCredentials: SipCredentials
  sipConfig: SipConfig
  store: any
  containerStyle: any
}

export let phoneStore = defaultStore

export const ReactSipPhone = ({
  name,
  width = 300,
  store,
  sipConfig,
  sipCredentials,
  containerStyle = {}
}: Props) => {
  //If no store is passed into component, default store is used
  const phoneStore = store ? store : defaultStore
  return (
    <Provider store={phoneStore}>
      <SipWrapper sipConfig={sipConfig} sipCredentials={sipCredentials}>
        <div className={styles.container} style={{ ...containerStyle, width: `${width < 300 ? 300 : width}px` }}>
          <Status name={name} />
          <Dialstring />
          <PhoneSessions />
        </div>
      </SipWrapper>
    </Provider>
  )
}
