import { Action } from './models'
import {
  NEW_SESSION,
  NEW_ATTENDED_TRANSFER,
  SIPSESSION_ATTENDED_TRANSFER_CANCEL,
  SIPSESSION_ATTENDED_TRANSFER_FAIL,
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
    incomingCalls: [],
    stateChanged: 0,
    onHold: [],
    attendedTransfers: []
  },
  action: Action
) => {
  const { type, payload } = action
  switch (type) {
    case INCOMING_CALL:
      console.log('Incoming call')
      return {
        ...state,
        sessions: { ...state.sessions, [payload.id]: payload },
        incomingCalls: [...state.incomingCalls, payload.id]
      }
    case NEW_SESSION:
      console.log('New session added')
      return {
        ...state,
        sessions: { ...state.sessions, [payload.id]: payload }
      }
    case NEW_ATTENDED_TRANSFER:
      return {
        ...state,
        sessions: { ...state.sessions, [payload.id]: payload },
        attendedTransfers: [...state.attendedTransfers, payload.id]
      }
    case SIPSESSION_ATTENDED_TRANSFER_CANCEL:
    case SIPSESSION_ATTENDED_TRANSFER_FAIL:
      const newAttendedTransfers = [...state.attendedTransfers].filter(
        (id) => id !== payload.id
      )
      return {
        ...state,
        attendedTransfers: newAttendedTransfers
      }
    case ACCEPT_CALL:
      const acceptedIncoming = [...state.incomingCalls].filter(
        (id) => id !== payload.id
      )
      return {
        ...state,
        incomingCalls: acceptedIncoming
      }
    case DECLINE_CALL:
      const declinedIncoming = [...state.incomingCalls].filter(
        (id) => id !== payload.id
      )
      const declinedSessions: any = { ...state.sessions }
      delete declinedSessions[payload.id]
      return {
        ...state,
        incomingCalls: declinedIncoming,
        sessions: declinedSessions
      }
    case SIPSESSION_STATECHANGE:
      return {
        ...state,
        stateChanged: state.stateChanged + 1
      }
    case CLOSE_SESSION:
      const closedIncoming = [...state.incomingCalls].filter(
        (id) => id !== payload
      )
      const newSessions: any = { ...state.sessions }
      delete newSessions[payload]
      const endHold = [...state.onHold].filter((id) => id !== payload)

      return {
        ...state,
        sessions: newSessions,
        incomingCalls: closedIncoming,
        onHold: endHold
      }
    case SIPSESSION_HOLD_REQUEST:
      return {
        ...state,
        onHold: [...state.onHold, payload]
      }
    case SIPSESSION_UNHOLD_REQUEST:
      const newHold = [...state.onHold].filter((id) => id !== payload)

      return {
        ...state,
        onHold: newHold
      }
    default:
      return state
  }
}
export default sipSessions
