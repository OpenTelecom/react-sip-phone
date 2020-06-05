import { Action } from './models'
import {
  NEW_SESSION,
  CLOSE_SESSION,
  SIPSESSION_STATECHANGE,
  INCOMING_CALL,
  ACCEPT_CALL,
  DECLINE_CALL,
  SIPSESSION_HOLD_REQUEST,
  SIPSESSION_UNHOLD_REQUEST
} from '../actions/sipSessions'
const sipSessions = (
  state = {
    sessions: {},
    incomingCalls: {},
    stateChanged: 0,
    onHold: {}
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call')
      return {
        ...state,
        incomingCalls: { ...state.incomingCalls, [payload.id]: payload }
      }
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state,
        sessions: { ...state.sessions, [payload.id]: payload }
      }
    case ACCEPT_CALL:
      const acceptedIncoming: any = { ...state.incomingCalls }
      delete acceptedIncoming[payload.id]
      return {
        ...state,
        incomingCalls: acceptedIncoming,
        sessions: { ...state.sessions, [payload.id]: payload }
      }
    case DECLINE_CALL:
      const declinedIncoming: any = { ...state.incomingCalls }
      delete declinedIncoming[payload.id]
      return {
        ...state,
        incomingCalls: declinedIncoming
      }
    case SIPSESSION_STATECHANGE:
      return {
        ...state,
        stateChanged: state.stateChanged + 1
      }
    case CLOSE_SESSION:
      const newIncoming: any = { ...state.incomingCalls }
      const newSessions: any = { ...state.sessions }
      delete newSessions[payload]
      delete newIncoming[payload]
      return {
        ...state,
        sessions: newSessions,
        incomingCalls: newIncoming
      }
    case SIPSESSION_HOLD_REQUEST:
      return {
        ...state,
        onHold: { ...state.onHold, [payload]: true }
      }
    case SIPSESSION_UNHOLD_REQUEST:
      const newHold: any = { ...state.onHold }
      delete newHold[payload]
      return {
        ...state,
        onHold: newHold
      }
    default:
      return state
  }
}
export default sipSessions
