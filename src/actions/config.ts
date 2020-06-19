import { PhoneConfig } from '../models'

export const SET_CREDENTIALS = 'SET_CREDENTIALS'
export const SET_CONFIG = 'SET_CONFIG'

export const setCredentials = (uri: string = '', password: string = '') => {
  return { type: SET_CREDENTIALS, payload: {uri, password} }
}

export const setPhoneConfig = (config: PhoneConfig) => {
  return { type: SET_CONFIG, payload: config}
}