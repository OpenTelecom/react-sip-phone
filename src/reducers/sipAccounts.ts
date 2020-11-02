import { Action } from './models'
import { NEW_USERAGENT, NEW_ACCOUNT } from '../actions/sipAccounts'

const sipAccounts = (
  state = {
    sipAccount: null,
    userAgent: null,
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
    default:
      return state
  }
}

export default sipAccounts
