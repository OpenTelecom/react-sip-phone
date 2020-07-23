import { PhoneConfig, AppConfig } from '../models'

export const SET_CREDENTIALS = 'SET_CREDENTIALS'
export const SET_PHONE_CONFIG = 'SET_PHONE_CONFIG'
export const SET_APP_CONFIG = 'SET_APP_CONFIG'
export const STRICT_MODE_SHOW_CALL_BUTTON = 'STRICT_MODE_SHOW_CALL_BUTTON'
export const STRICT_MODE_HIDE_CALL_BUTTON = 'STRICT_MODE_HIDE_CALL_BUTTON'
export const ATTENDED_TRANSFER_LIMIT_REACHED = 'ATTENDED_TRANSFER_LIMIT_REACHED'
export const SESSIONS_LIMIT_REACHED = 'SESSIONS_LIMIT_REACHED'

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
  return {type: STRICT_MODE_SHOW_CALL_BUTTON}
}

export const setAppConfigCallEnded = () =>{
  return {type: STRICT_MODE_HIDE_CALL_BUTTON}
}

export const attendedTransferLimitReached = () => {
  return {type: ATTENDED_TRANSFER_LIMIT_REACHED}
}

export const sessionsLimitReached = () => {
  return {type: SESSIONS_LIMIT_REACHED}
}