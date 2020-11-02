// eslint-disable-next-line no-unused-vars
import { Action } from './models'
import {
  SET_CREDENTIALS,
  SET_PHONE_CONFIG,
  SET_APP_CONFIG,
  STRICT_MODE_SHOW_CALL_BUTTON,
  STRICT_MODE_HIDE_CALL_BUTTON
} from '../actions/config'

const config = (
  state = {
    uri: '',
    password: '',
    phoneConfig: {},
    appConfig: { mode: '', started: false, appSize: '' }
  },
  action: Action
) => {
  switch (action.type) {
    case SET_PHONE_CONFIG:
      return {
        ...state,
        phoneConfig: action.payload
      }
    case SET_CREDENTIALS:
      return {
        ...state,
        uri: action.payload.uri,
        password: action.payload.password,
      }
    case SET_APP_CONFIG:
      return {
        ...state,
        appConfig: action.payload
      }
    case STRICT_MODE_SHOW_CALL_BUTTON:
      if (state.appConfig.mode === 'strict') {
        return {
          ...state,
          appConfig:{
            ...state.appConfig,
            mode: 'strict',
            started: true
          }
        }
      }
      return state
    case STRICT_MODE_HIDE_CALL_BUTTON:
      if (state.appConfig.mode === 'strict'){
        return {
          ...state,
          appConfig:{
            ...state.appConfig,
            mode: 'strict',
            started: false
          }
        }
      }
      return state
    default:
      return state
  }
}

export default config
