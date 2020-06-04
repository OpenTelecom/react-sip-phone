import { Action } from './models'
import { INCOMING_CALL, NEW_USERAGENT, NEW_ACCOUNT } from '../actions/sipAccounts'
const sipAccounts = (
  state = {
    sipAccount: null,
    userAgent: null,
    incomingCalls: [],
    status: ''
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case NEW_ACCOUNT:
      return {
        ...state,
        sipAccount: action.payload
      }
    case NEW_USERAGENT:
      return {
        ...state,
        userAgent: payload
      }
    case INCOMING_CALL:
      console.log('Incoming call')
      return {
        ...state,
        incomingCalls: {...state.incomingCalls, [payload.id]: payload}
      }
    default:
      return state
  }
}
export default sipAccounts
