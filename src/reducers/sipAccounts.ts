import { Action } from './models'
import { INCOMING_CALL, SIPACCOUNT_UNREGISTERED } from '../actions/sipAccounts'
const sipAccounts = (
  state = {
    incomingCalls: [],
    status
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call')
      return {
        ...state,
        incomingCalls: [...state.incomingCalls, payload]
      }
    case SIPACCOUNT_UNREGISTERED:
      return {
        ...state,
        status: payload
      }
    default:
      return state
  }
}
export default sipAccounts
