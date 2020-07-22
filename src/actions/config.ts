import { PhoneConfig, AppConfig } from '../models'

export const SET_CREDENTIALS = 'SET_CREDENTIALS'
export const SET_PHONE_CONFIG = 'SET_PHONE_CONFIG'
export const SET_APP_CONFIG = 'SET_APP_CONFIG'
export const STRICT_MODE_CALL_STARTED = 'STRICT_MODE_CALL_STARTED'
export const STRICT_MODE_CALL_ENDED = 'STRICT_MODE_CALL_ENDED'

export const setCredentials = (uri: string = '', password: string = '') => {
  return { type: SET_CREDENTIALS, payload: {uri, password} }
}

export const setPhoneConfig = (config: PhoneConfig) => {
  return { type: SET_PHONE_CONFIG, payload: config}
}

export const setAppConfig = (config: AppConfig) => {
  return { type: SET_APP_CONFIG, payload: config}
}

export const setAppConfigStarted = () => {
  return {type: STRICT_MODE_CALL_STARTED}
}

export const setAppConfigCallEnded = () =>{
  return {type: STRICT_MODE_CALL_ENDED}
}