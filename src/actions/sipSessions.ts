import { Session, SessionState } from 'sip.js'
export const NEW_SESSION = 'NEW_SESSION'
export const NEW_ATTENDED_TRANSFER = 'NEW_ATTENDED_TRANSFER'
export const INCOMING_CALL = 'INCOMING_CALL'

export const ACCEPT_CALL = 'ACCEPT_CALL'
export const DECLINE_CALL = 'DECLINE_CALL'

export const SIPSESSION_STATECHANGE = 'SIPSESSION_STATECHANGE'
export const CLOSE_SESSION = 'CLOSE_SESSION'

export const SIPSESSION_MAKECALL_REQUEST = 'SIPSESSION_MAKECALL_REQUEST'
export const SIPSESSION_MAKECALL_SUCCESS = 'SIPSESSION_MAKECALL_SUCCESS'
export const SIPSESSION_MAKECALL_FAIL = 'SIPSESSION_MAKECALL_FAIL'

export const SIPSESSION_HOLD_REQUEST = 'SIPSESSION_HOLD_REQUEST'
export const SIPSESSION_HOLD_SUCCESS = 'SIPSESSION_HOLD_SUCCESS'
export const SIPSESSION_HOLD_FAIL = 'SIPSESSION_HOLD_FAIL'
export const SIPSESSION_UNHOLD_REQUEST = 'SIPSESSION_UNHOLD_REQUEST'
export const SIPSESSION_UNHOLD_SUCCESS = 'SIPSESSION_UNHOLD_SUCCESS'
export const SIPSESSION_UNHOLD_FAIL = 'SIPSESSION_UNHOLD_FAIL'

export const SIPSESSION_MUTE_REQUEST = 'SIPSESSION_MUTE_REQUEST'
export const SIPSESSION_MUTE_SUCCESS = 'SIPSESSION_MUTE_SUCCESS'
export const SIPSESSION_MUTE_FAIL = 'SIPSESSION_MUTE_FAIL'
export const SIPSESSION_UNMUTE_REQUEST = 'SIPSESSION_UNMUTE_REQUEST'
export const SIPSESSION_UNMUTE_SUCCESS = 'SIPSESSION_UNMUTE_SUCCESS'
export const SIPSESSION_UNMUTE_FAIL = 'SIPSESSION_UNMUTE_FAIL'

export const SIPSESSION_BLIND_TRANSFER_REQUEST =
  'SIPSESSION_BLIND_TRANSFER_REQUEST'
export const SIPSESSION_BLIND_TRANSFER_SUCCESS =
  'SIPSESSION_BLIND_TRANSFER_SUCCESS'
export const SIPSESSION_BLIND_TRANSFER_FAIL = 'SIPSESSION_BLIND_TRANSFER_FAIL'

export const SIPSESSION_ATTENDED_TRANSFER_REQUEST =
  'SIPSESSION_ATTENDED_TRANSFER_REQUEST'
export const SIPSESSION_ATTENDED_TRANSFER_PENDING =
  'SIPSESSION_ATTENDED_TRANSFER_PENDING'
export const SIPSESSION_ATTENDED_TRANSFER_READY =
  'SIPSESSION_ATTENDED_TRANSFER_READY'
export const SIPSESSION_ATTENDED_TRANSFER_CANCEL =
  'SIPSESSION_ATTENDED_TRANSFER_CANCEL'
export const SIPSESSION_ATTENDED_TRANSFER_FAIL =
  'SIPSESSION_ATTENDED_TRANSFER_FAIL'
export const SIPSESSION_ATTENDED_TRANSFER_SUCCESS =
  'SIPSESSION_ATTENDED_TRANSFER_SUCCESS'

export const acceptCall = (session: Session) => {
  return { type: ACCEPT_CALL, payload: session }
}

export const declineCall = (session: Session) => {
  return { type: DECLINE_CALL, payload: session }
}

export const endCall = (sessionId: string) => {
  return { type: CLOSE_SESSION, payload: sessionId }
}

export const holdCallRequest = (session: Session) => {
  if (
    !session.sessionDescriptionHandler ||
    session.state !== SessionState.Established
  ) {
    return { type: SIPSESSION_HOLD_FAIL }
  }
  try {
    session.invite({
      sessionDescriptionHandlerModifiers: [
        session.sessionDescriptionHandler!.holdModifier
      ]
    })
    return { type: SIPSESSION_HOLD_REQUEST, payload: session.id }
  } catch (err) {
    return { type: SIPSESSION_HOLD_FAIL }
  }
}
export const unHoldCallRequest = (session: Session) => {
  if (
    !session.sessionDescriptionHandler ||
    session.state !== SessionState.Established
  ) {
    return { type: SIPSESSION_UNHOLD_FAIL }
  }
  try {
    session.invite()
    return { type: SIPSESSION_UNHOLD_REQUEST, payload: session.id }
  } catch (err) {
    return { type: SIPSESSION_UNHOLD_FAIL }
  }
}
