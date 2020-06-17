import { Action } from './models'
import { SET_CREDENTIALS, SET_CONFIG } from '../actions/config'
const config = (state = {
  uri: '',
  password: '',
  phoneConfig: {}
}, action: Action) => {
  switch (action.type) {
    case SET_CONFIG:
      return {
        ...state, phoneConfig: action.payload
      }
    case SET_CREDENTIALS:
      return {
        ...state,
        uri: action.payload.uri,
        password: action.payload.password,
      }
    default:
      return state
  }
}
export default config