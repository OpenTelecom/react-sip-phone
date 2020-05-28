import { INCOMING_CALL } from '../actions/sipAccounts'
const sipAccounts = (state = {
  incomingCalls: []
}, action: { type: string, payload: any }) => {
  const { type, payload } = action
  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call')
      return {
        ...state, incomingCalls: [...state.incomingCalls, payload]
      }
    default:
      return state
  }
}
export default sipAccounts