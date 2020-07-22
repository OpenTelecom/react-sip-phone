import { Action } from './models'
import { SET_CREDENTIALS, SET_PHONE_CONFIG, SET_APP_CONFIG, STRICT_MODE_CALL_STARTED, STRICT_MODE_CALL_ENDED } from '../actions/config'
const config = (state = {
  uri: '',
  password: '',
  phoneConfig: {},
  appConfig:{
    mode:'',
    started:false
  }
}, action: Action) => {
  switch (action.type) {
    case SET_PHONE_CONFIG:
      return {
        ...state, phoneConfig: action.payload
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
        appConfig:action.payload
      }
    case STRICT_MODE_CALL_STARTED:
      if(state.appConfig.mode === 'strict'){
        return {
          ...state,
          appConfig:{
            mode:'strict',
            started:true
          }
        }
      }
      case STRICT_MODE_CALL_ENDED:
        if(state.appConfig.mode === 'strict'){
          return {
            ...state,
            appConfig:{
              mode:'strict',
              started:false
          }
        }
      }
    default:
      return state
  }
}
export default config