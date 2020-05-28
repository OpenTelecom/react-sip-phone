import { Action } from './models'
import {
  NEW_SESSION,
  SIPSESSION_ESTABLISHED,
  SIPSESSION_ESTABLISHING,
  SIPSESSION_TERMINATING,
  SIPSESSION_TERMINATED
} from '../actions/sipSessions'
const sipSessions = (
  state = {
    phone1: { outgoing: '', incoming: '' },
    phone2: { outgoing: '', incoming: '' }
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state,
        sessions: { ...state.phone1, outgoing: payload }
      }
    case SIPSESSION_ESTABLISHING:
      return {
        ...state,
        phone1: { ...state.phone1, outgoing: payload }
      }
    case SIPSESSION_ESTABLISHED:
      return {
        ...state,
        phone1: { ...state.phone1, outgoing: payload }
      }
    case SIPSESSION_TERMINATING:
      return {
        ...state,
        phone1: { ...state.phone1, outgoing: payload }
      }
    case SIPSESSION_TERMINATED:
      return {
        ...state,
        phone1: { ...state.phone1, outgoing: payload }
      }
    default:
      return state
  }
}
export default sipSessions
