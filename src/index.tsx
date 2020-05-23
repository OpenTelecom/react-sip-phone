import * as React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers/index'
import styles from './styles.module.scss'
import SipWrapper from './SipWrapper'
import Status from './components/Status'
import { SipConfig, SipCredentials } from './models'

export const reactSipPhoneReducers = reducers

function generateOwnStore() {
  return createStore(reducers, applyMiddleware(thunk))
}
interface Props {
  width: number,
  name: string,
  sipCredentials: SipCredentials,
  sipConfig: SipConfig,
  store: any
}

export const ReactSipPhone = ({ name, width, store, sipConfig, sipCredentials }: Props) => {
  const phoneStore = store ? store : generateOwnStore()
  return <Provider store={phoneStore}>
    <SipWrapper sipConfig={sipConfig} sipCredentials={sipCredentials} >
      <div className={styles.container} style={{ width: `${width}px` }}>
        <Status name={name} />
      </div>
    </SipWrapper>
  </Provider>
}