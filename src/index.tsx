import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import styles from './styles.scss'
import SipWrapper from './SipWrapper'
import Status from './components/Status'
import PhoneSessions from './components/PhoneSessions'
import Dialstring from './components/Dialstring'
import { SipConfig, SipCredentials, PhoneConfig, AppConfig } from './models'

import { defaultStore, persistor } from './store/configureStore'

interface Props {
  width: number
  height: number
  name: string
  phoneConfig: PhoneConfig
  sipCredentials: SipCredentials
  sipConfig: SipConfig
  appConfig: AppConfig
  containerStyle: any
}

export const phoneStore = defaultStore

export const ReactSipPhone = ({
  name,
  width = 300,
  height = 600,
  phoneConfig,
  sipConfig,
  appConfig,
  sipCredentials,
  containerStyle = {}
}: Props) => {
  // If no store is passed into component, default store is used
  return (
    <Provider store={phoneStore}>
      <PersistGate loading={null} persistor={persistor}>
        <SipWrapper
          sipConfig={sipConfig}
          sipCredentials={sipCredentials}
          phoneConfig={phoneConfig}
          appConfig={appConfig}
        >
          <div className={styles.container}
            style={{
              ...containerStyle,
              width: `${width < 300 ? 300 : width}px`,
              height: `${height < 600 ? 600 : height}px`
            }}
          >
            <Status
              phoneConfig={phoneConfig}
              appConfig={appConfig}
              name={name}
            />
            {phoneConfig.disabledFeatures.includes('dialstring') ? null : (
              <Dialstring
                sipConfig={sipConfig}
                phoneConfig={phoneConfig}
                appConfig={appConfig}
              />
            )}

            <PhoneSessions phoneConfig={phoneConfig} />
            <audio id='tone' autoPlay />
          </div>
        </SipWrapper>
      </PersistGate>
    </Provider>
  )
}
