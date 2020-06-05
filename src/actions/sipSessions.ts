import { Session } from 'sip.js'
export const NEW_SESSION = 'NEW_SESSION'
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
export const SIPSESSION_ATTENDED_TRANSFER_FAIL =
  'SIPSESSION_ATTENDED_TRANSFER_FAIL'
export const SIPSESSION_ATTENDED_TRANSFER_SUCCESS =
  'SIPSESSION_ATTENDED_TRANSFER_SUCCESS'

export const ATTENDED_TRANSFER_SUCCESS = 'ATTENDED_TRANSFER_SUCCESS'
export const ATTENDED_TRANSFER_FAIL = 'ATTENDED_TRANSFER_FAIL'

export const acceptCall = (session: Session) => {
  return { type: ACCEPT_CALL, payload: session }
}

export const declineCall = (session: Session) => {
  return { type: DECLINE_CALL, payload: session }
}

export const endCall = (sessionId: string) => {
  return { type: CLOSE_SESSION, payload: sessionId }
}

export const holdCallRequest = (sessionId: string) => {
  return { type: SIPSESSION_HOLD_REQUEST, payload: sessionId }
}

export const holdCallSuccess = () => {
  return { type: SIPSESSION_HOLD_SUCCESS }
}

export const holdCallFail = () => {
  return { type: SIPSESSION_HOLD_FAIL }
}

export const unHoldCallRequest = (sessionId: string) => {
  return { type: SIPSESSION_UNHOLD_REQUEST, payload: sessionId }
}

export const unHoldCallSuccess = () => {
  return { type: SIPSESSION_UNHOLD_SUCCESS }
}

export const unHoldCallFail = () => {
  return { type: SIPSESSION_UNHOLD_FAIL }
}

export const muteCallRequest = (sessionId: string) => {
  return { type: SIPSESSION_MUTE_REQUEST, payload: sessionId }
}

export const muteCallSuccess = () => {
  return { type: SIPSESSION_MUTE_SUCCESS }
}

export const muteCallFail = () => {
  return { type: SIPSESSION_MUTE_FAIL }
}

export const unMuteCallRequest = (sessionId: string) => {
  return { type: SIPSESSION_UNMUTE_REQUEST, payload: sessionId }
}
export const unMuteCallSuccess = () => {
  return { type: SIPSESSION_UNMUTE_SUCCESS }
}

export const unMuteCallFail = () => {
  return { type: SIPSESSION_UNMUTE_FAIL }
}

export const blindTransferRequest = () => {
  return { type: SIPSESSION_BLIND_TRANSFER_REQUEST }
}
export const blindTransferSuccess = () => {
  return { type: SIPSESSION_BLIND_TRANSFER_SUCCESS }
}

export const blindTransferFail = () => {
  return { SIPSESSION_BLIND_TRANSFER_FAIL }
}
