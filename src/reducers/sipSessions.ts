import { Action } from './models'
import {
  NEW_SESSION,
  CLOSE_SESSION,
  SIPSESSION_STATECHANGE
} from '../actions/sipSessions'
const sipSessions = (
  state = {
    sessions: {},
    stateChanged: 0
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state,
        sessions: {...state.sessions, [payload.id]: payload}
      }
    case SIPSESSION_STATECHANGE:
      return {
        ...state,
        stateChanged: state.stateChanged + 1
      }
    case CLOSE_SESSION:
      const newSessions: any = {...state.sessions}
      delete newSessions[payload]
      return {
        ...state,
        sessions: newSessions
      }
    default:
      return state
  }
}
export default sipSessions
